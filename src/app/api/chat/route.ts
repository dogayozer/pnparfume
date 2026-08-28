// @ts-nocheck
import { getAIModel } from '@/lib/ai-gateway'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getProductKasapImage } from '@/lib/kasapImages'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// In-memory rate limiting map for chat: IP -> { count: number, resetAt: number }
const chatRateLimits = new Map<string, { count: number; resetAt: number }>()

function checkChatRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = chatRateLimits.get(ip)

  if (!record || now > record.resetAt) {
    chatRateLimits.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    return true
  }

  if (record.count >= 25) {
    return false
  }

  record.count += 1
  return true
}

export async function POST(req: Request) {
  const t0 = Date.now()
  let tFirstToken: number | null = null

  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip'
    if (!checkChatRateLimit(ip)) {
      return new Response(
        JSON.stringify({ 
          text: 'Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.', 
          toolResults: [] 
        }), 
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { messages, userId } = await req.json()

    // 1. Fetch AI Config from DB with timing
    const tConfigStart = Date.now()
    const config = await prisma.aiConfig.findFirst()
    const configMs = Date.now() - tConfigStart

    // 1.5 Giriş yapmış müşteriyi tanı (varsa) — Aura'nın ismiyle hitap edebilmesi,
    // gerçek referans kodunu/cüzdan bakiyesini söyleyebilmesi için. userId yoksa
    // (anonim ziyaretçi) bu adım tamamen atlanır, ekstra sorgu yapılmaz.
    let customer: { name: string | null, referral_code: string | null, wallet_balance: number } | null = null
    if (userId) {
      try {
        customer = await prisma.customer.findUnique({
          where: { id: userId },
          select: { name: true, referral_code: true, wallet_balance: true }
        })
      } catch (e) {
        console.error('Customer lookup error:', e)
      }
    }

    const DEFAULT_SYSTEM_PROMPT = `Sen PN Parfüm'ün Kişisel Koku Uzmanı ve Yapay Zeka Satış Asistanısın. 
Adın "Aura". Müşterilerle son derece lüks, samimi ve ikna edici bir dille konuşuyorsun.
Mesajların kısa, zarif ve vurucu olmalı.

KULLANICI PARFÜM ÖNERİSİ İSTEDİĞİNDE:
1. Önce kime baktığını (Kadın, Erkek, Unisex) ve hangi ortamda kullanacağını (Günlük, Ofis, Gece, Özel Davet) sor.
2. Sevdiği koku tarzını (Odunsu, Çiçeksi, Ferah/Narenciye, Oryantal/Baharatlı) öğren.
3. Ardından "searchProducts" aracını çağırarak en uygun 2 veya 3 parfümü öner.
4. Müşteri bilinen bir parfüm ismi sorarsa (Örn: Baccarat, Sauvage, Aventus, Tom Ford benzeri), doğrudan ona en yakın koku profiline sahip PN parfümlerini bul ve zarifçe sun.

SATIŞ KAPATMA VE İNDİRİM:
- Müşteri kararsız kaldığında veya indirim istediğinde, inisiyatif alarak "generateDiscount" aracını kullan ve ona özel bir kupon kodu oluştur.
- Her ürün önerdiğinde SKU kodunu belirt (Örn: "PN 101").`

    let systemPrompt = config?.system_prompt || DEFAULT_SYSTEM_PROMPT;

    // TELİF/MARKA KURALI (KESİN): HER ZAMAN EKLENMELİ
    systemPrompt += `\n\nTELİF/MARKA KURALI (KESİN):
- Kendi ürünlerimizden bahsederken ASLA başka bir markanın veya "ilham alınan" orijinal parfümün adını yazma (Örn: Gucci, Dior, Tom Ford, Sauvage vb.) — SADECE "PN {kod}" formatını kullan.
- Müşteri "Sauvage'e benzer bir şey var mı?" gibi bir marka adı söylerse, cevabında o marka adını tekrar etme; doğrudan "PN {kod}" ile öner.`

    // SATIŞ ÖNCELİĞİ (KESİN): HER ZAMAN EKLENMELİ — deneyim iyi olsun ama nihai
    // görev satış. Kupon/tavsiye programı ÇAKTIRMADAN, sohbetin doğal bir parçası
    // gibi geçmeli — asla ısrarcı, asla "İNDİRİM! FIRSAT!" tonunda değil.
    systemPrompt += `\n\nSATIŞ ÖNCELİĞİ (KESİN):
- Deneyimi kusursuz ve samimi tut, ama unutma: nihai görevin satış yapmak. Her sohbeti, doğal bir şekilde bir öneriye veya sepete ekleme adımına yönlendir.
- Müşteri kararsız kaldığında, fiyat sorduğunda veya "pahalı" dediğinde inisiyatif al ve "generateDiscount" aracıyla ona özel bir kod oluştur. Bunu bir satış taktiği gibi değil, kişisel bir jest gibi sun (Örn: "Sizin için özel bir şey hazırladım").
- Müşteri hemen karar vermek istemiyorsa, oluşturduğun kodu "şimdi değil, 24 saat içinde istediğin an kullanabilirsin" diye çerçevele — yani kodun sadece şu anki sohbete değil, bugün içindeki SONRAKİ bir alışverişine de geçerli olduğunu belirt (kod müşterinin hesabındaki kupon kasasına kaydedilir, 24 saat geçerlidir — bu süreyi asla "sınırsız" veya "hep geçerli" gibi yanlış tanıtma).
- Sohbetin doğal bir anında (örn. müşteri memnun görünüyorsa veya vedalaşırken), tavsiye/referans programını ÇAKTIRMADAN, tek cümleyle hatırlat: bir arkadaşını PN Parfüm'e davet edip alışveriş yaptırırsa, kendi hesabına cüzdan bakiyesi/puan kazanır. Bunu her mesajda tekrarlama, zorlama, ısrar etme — sohbeti bitiren bir "bu arada" notu gibi bırak.
- Bu üç unsuru (indirim kodu, sonraki alışveriş için geçerliliği, tavsiye programı) asla aynı anda, liste halinde, reklam gibi sıralama — sohbetin akışına göre en fazla birini, en doğal olanını seç.
- KOD/ORAN UYDURMA (KESİN): Cevabında bir indirim kodu veya yüzdesi yazacaksan, bu MUTLAKA "generateDiscount" aracını çağırıp dönen sonuçtaki GERÇEK kod ve GERÇEK yüzde olmalı — asla kendi uydurduğun bir kod (örn. "AURA15") veya farklı bir yüzde yazma. Aracı çağırmadan indirimden bahsetme.`

    // MÜŞTERİ BİLGİSİ: sadece giriş yapmış (userId gönderilmiş) ziyaretçilerde var.
    // Anonim ziyaretçide bu blok hiç eklenmez — o durumda Aura ismiyle hitap etmemeli,
    // "senin kodun X" dememeli, programı sadece genel hatlarıyla anlatmalı.
    if (customer) {
      systemPrompt += `\n\nGİRİŞ YAPMIŞ MÜŞTERİ BİLGİSİ (gerçek veri, uydurma):
- Adı: ${customer.name || 'bilinmiyor (isimle hitap etme)'}
- Cüzdan bakiyesi: ${customer.wallet_balance} TL
- Kendi tavsiye/referans kodu: ${customer.referral_code || 'YOK — henüz Marka Elçisi programına katılmamış'}
${customer.referral_code
  ? `Tavsiye programından bahsederken kendi GERÇEK kodunu ("${customer.referral_code}") söyleyebilirsin.`
  : `Referans kodu YOK — "senin kodun şu" diye bir kod UYDURMA. Bunun yerine, tavsiye programından bahsedeceğin doğal bir anda, "Girişimcilere Özel" / Marka Elçisi programına katılarak kendi kodunu edinebileceğini nazikçe belirt.`}`
    } else {
      systemPrompt += `\n\nMÜŞTERİ ANONİM (giriş yapmamış): İsimle hitap etme, hiçbir özel kod/bakiye uydurma. Tavsiye programından bahsedeceksen sadece genel hatlarıyla anlat.`
    }

    if (config?.active_campaign) {
      systemPrompt += `\n\nAKTİF KAMPANYA:\n${config.active_campaign}`
    }

    const canGiveDiscount = config?.can_give_discount ?? true
    const discountLimit = config?.discount_limit ?? 20

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    const collectedToolResults: any[] = []

    // 2. Stream LLM Response
    const result = streamText({
      model: getAIModel(),
      system: systemPrompt,
      messages,
      tools: {
        searchProducts: tool({
          description: 'Veritabanında parfüm araması yapar. Cinsiyet, koku ailesi veya tarza göre arar.',
          parameters: z.object({
            query: z.string().optional().describe('Arama terimi veya nota (Örn: vanilya, odunsu, tatlı)'),
            gender: z.string().optional().describe('Cinsiyet (Erkek, Kadın, Unisex)'),
            occasion: z.string().optional().describe('Kullanım alanı (Günlük, Ofis, Gece)'),
            family: z.string().optional().describe('Koku ailesi (Odunsu, Çiçeksi, Ferah, Oryantal)')
          }),
          execute: async ({ query = '', gender, occasion, family }: any) => {
            const tToolStart = Date.now()
            try {
              let products = await prisma.product.findMany({
                where: {
                  AND: [
                    query ? {
                      OR: [
                        { sku: { contains: query, mode: 'insensitive' } },
                        { mood_tag: { contains: query, mode: 'insensitive' } },
                        { persona_tag: { contains: query, mode: 'insensitive' } },
                        { original_name: { contains: query, mode: 'insensitive' } },
                        { fragrance_family: { has: query } }
                      ]
                    } : {},
                    gender ? { gender: { equals: gender, mode: 'insensitive' } } : {},
                    occasion ? { occasion_tag: { contains: occasion, mode: 'insensitive' } } : {},
                    family ? { fragrance_family: { has: family } } : {}
                  ]
                },
                take: 3,
                select: {
                  sku: true,
                  gender: true,
                  fragrance_family: true, 
                  mood_tag: true,
                  top_notes: true,
                  heart_notes: true,
                  base_notes: true
                }
              })
              
              if (products.length === 0) {
                products = await prisma.product.findMany({
                  take: 3,
                  select: {
                    sku: true,
                    gender: true,
                    fragrance_family: true, 
                    mood_tag: true,
                    top_notes: true,
                    heart_notes: true,
                    base_notes: true
                  }
                })
              }

              const enriched = products.map(p => ({
                ...p,
                price: 850,
                image: getProductKasapImage(p.sku)
              }))

              collectedToolResults.push({
                toolName: 'searchProducts',
                result: enriched,
                executionMs: Date.now() - tToolStart
              })

              return enriched
            } catch (e: any) {
              return { error: 'Search error: ' + e.message }
            }
          },
        }),
        generateDiscount: tool({
          description: 'Müşteriyi ikna etmek için özel indirim kuponu oluşturur.',
          parameters: z.object({
            discountPercentage: z.number().describe('İndirim yüzdesi (10 ile 25 arası)'),
            reason: z.string().describe('İndirim sebebi')
          }),
          execute: async ({ discountPercentage, reason }: any) => {
            const tToolStart = Date.now()
            try {
              if (!canGiveDiscount) {
                return { error: 'İndirim tanımlanamıyor' }
              }
              
              const actualDiscount = Math.min(Number(discountPercentage) || 10, Number(discountLimit) || 20)
              const code = 'AURA' + Math.random().toString(36).substring(2, 7).toUpperCase()
              
              await prisma.coupon.create({
                data: {
                  code,
                  discount_type: 'percentage',
                  value: actualDiscount,
                  source: 'ai_aura',
                  is_ai_generated: true,
                  is_active: true,
                  usage_limit: 1,
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                }
              })

              const discountRes = { 
                code, 
                discountPercentage: actualDiscount, 
                reason: reason || 'Aura Özel İndirimi',
                message: `Size özel %${actualDiscount} indirim kuponunuz: ${code}`
              }

              collectedToolResults.push({
                toolName: 'generateDiscount',
                result: discountRes,
                executionMs: Date.now() - tToolStart
              })

              return discountRes
            } catch (e: any) {
              return { error: 'Kupon hatası: ' + e.message }
            }
          }
        })
      },
      maxSteps: 3
    })

    // Background stream handler with real-time SSE chunking & timing
    ;(async () => {
      try {
        for await (const delta of result.textStream) {
          if (!tFirstToken) {
            tFirstToken = Date.now()
          }
          const chunkData = JSON.stringify({ type: 'token', value: delta }) + '\n'
          await writer.write(encoder.encode(chunkData))
        }

        // Wait for steps/tools to complete
        await result.steps

        const totalMs = Date.now() - t0
        const ttftMs = tFirstToken ? tFirstToken - t0 : totalMs

        // Log diagnostics for observability
        console.log(`[AURA PERFORMANCE] Total: ${totalMs}ms | Config: ${configMs}ms | TTFT: ${ttftMs}ms | Tools: ${collectedToolResults.length}`)

        // Send final metadata chunk with tool results
        const finalData = JSON.stringify({
          type: 'done',
          toolResults: collectedToolResults,
          timing: {
            configMs,
            ttftMs,
            totalMs
          }
        }) + '\n'
        await writer.write(encoder.encode(finalData))
      } catch (streamErr) {
        console.error('[AURA STREAM ERROR]:', streamErr)
        const errorChunk = JSON.stringify({
          type: 'token',
          value: '\nSize yardımcı olmaktan mutluluk duyarım. Hangi koku tarzını tercih edersiniz? (Örn: Odunsu, Ferah veya Çiçeksi)'
        }) + '\n'
        await writer.write(encoder.encode(errorChunk))
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    })

  } catch (error: any) {
    console.error('[AURA ROOT ERROR]:', error)
    return new Response(JSON.stringify({ text: 'Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.' }), { status: 500 })
  }
}
