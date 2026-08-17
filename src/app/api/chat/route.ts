// @ts-nocheck
import { getAIModel } from '@/lib/ai-gateway'
import { generateText, tool } from 'ai'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Fetch AI Config from DB
  const config = await prisma.aiConfig.findFirst()
  
  let systemPrompt = config?.system_prompt || `Sen PN Parfüm'ün Kişisel Koku Uzmanı ve Yapay Zeka Asistanısın. 
Adın "Aura". Müşterilerle son derece kibar, lüks ve premium bir dille konuşuyorsun.
Küçük bir sohbet penceresinde (widget) hizmet veriyorsun, bu yüzden mesajların ÇOK KISA, net ve vurucu olmalı.

KULLANICI "BANA PARFÜM ÖNER" DERSE UYGULAMAN GEREKEN ADIMLAR (QUIZ MODU):
Kullanıcı parfüm önerisi istediğinde hemen rastgele ürünler sunma! Onu adım adım yönlendir:
1. Adım: Önce parfümü kimin için aradığını (Kadın, Erkek, Unisex) sor. SADECE BUNU SOR VE CEVABI BEKLE.
2. Adım: Cinsiyeti öğrendikten sonra, parfümü hangi etkinlikte veya ortamda kullanacağını (Günlük, Ofis, Gece, Spor vb.) sor. SADECE BUNU SOR VE CEVABI BEKLE.
3. Adım: Etkinliği öğrendikten sonra, nasıl kokulardan (Odunsu, Çiçeksi, Ferah, Baharatlı vb.) hoşlandığını sor. SADECE BUNU SOR VE CEVABI BEKLE.
4. Adım: Tüm cevapları (Cinsiyet, Etkinlik, Koku Ailesi) aldıktan sonra, "searchProducts" aracını çağırarak bu parametrelere uygun aramayı yap ve en uygun 3 parfümü sun.

DİĞER KURALLAR:
1. Müşteri spesifik bir marka/model sorarsa (Örn: Savage benzeri, Baccarat Rouge), adım adım soru sorma. Doğrudan bu isme en yakın içeriği veya notaları tahmin et ve searchProducts ile ara.
2. Ürün listeledikten sonra mutlaka satışa yönlendir (Örn: "Sepetinize eklemek ister misiniz?").
3. Müşteri indirim isterse veya kararsız kalırsa, inisiyatif alıp "generateDiscount" aracını kullanarak ona %10-%25 arası bir indirim tanımla.
4. Vereceğin yanıtlar maksimum 2-3 kısa cümleyi geçmesin. Bizim ürünümüzün diğer markanın "birebir kopyası" olduğunu SÖYLEME. Sadece "aradığınız o şık ve odunsu havayı veren, tarzınıza çok uygun bir parfümümüz var" şeklinde benzetme yap.
5. Bir parfümü överken daima SKU kodunu ver (Örn: "Size PN A001'i öneriyorum").
6. Müşteri indirim veya fırsat sorarsa "generateDiscount" aracını kullan.
7. Eğer "searchProducts" aracı "Kriterlere uygun ürün bulunamadı" hatası verirse, kullanıcıya asla "ürün bulamadım" deme! Kendi parfüm kültürünü kullanarak kullanıcının yazdığı kokunun içeriğini analiz et, ona benzeyen notalara sahip bizim ürünlerimizi tekrar ara ve "Bunu mu demek istemiştiniz? Aradığınız X parfümüne koku profili olarak en yakın şu ürünümüz var:" şeklinde zarif bir teklif sun.`

  if (config?.active_campaign) {
    systemPrompt += `\n\nAKTİF KAMPANYA/DUYURU:\n${config.active_campaign}`
  }

  const canGiveDiscount = config?.can_give_discount ?? true
  const discountLimit = config?.discount_limit ?? 20

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  
  // Send a space immediately to bypass Vercel 10s timeout
  writer.write(encoder.encode(" "))

  generateText({
    model: getAIModel(),
    system: systemPrompt,
    messages,
    tools: {
      searchProducts: tool({
        description: 'Veritabanında parfüm araması yapar. Kullanıcının ruh haline, içeriğe veya isme göre filtreleme yapabilirsiniz.',
        parameters: z.object({
          query: z.string().optional().describe('Genel arama terimi (Örn: tatlı, romantik)'),
          gender: z.string().optional().describe('Cinsiyet filtresi (Erkek, Kadın, Unisex)'),
          occasion: z.string().optional().describe('Etkinlik/Kullanım alanı (Örn: Günlük Kullanım, Gece Etkinliği, Ofis)'),
          family: z.string().optional().describe('Koku ailesi (Örn: Odunsu, Çiçeksi, Ferah)')
        }),
        execute: async ({ query = '', gender, occasion, family }: any) => {
          try {
            let products = await prisma.product.findMany({
              where: {
                AND: [
                  query ? {
                    OR: [
                      { sku: { contains: query, mode: 'insensitive' } },
                      { mood_tag: { contains: query, mode: 'insensitive' } },
                      { persona_tag: { contains: query, mode: 'insensitive' } },
                      { fragrance_family: { has: query } }
                    ]
                  } : {},
                  gender ? { gender: { equals: gender, mode: 'insensitive' } } : {},
                  occasion ? { occasion_tag: { contains: occasion, mode: 'insensitive' } } : {},
                  family ? { fragrance_family: { has: family } } : {}
                ]
              },
              take: 3,
              select: { sku: true, original_name: true, gender: true, fragrance_family: true, mood_tag: true, price: true }
            })
            
            // Eğer spesifik aramada ürün bulunamazsa, herhangi 3 ürünü getir (boş dönmemesi için)
            if (products.length === 0) {
              products = await prisma.product.findMany({
                take: 3,
                select: { sku: true, original_name: true, gender: true, fragrance_family: true, mood_tag: true, price: true }
              })
            }
            
            return products.length > 0 ? products : { error: 'Veritabanında henüz hiç ürün yok.' }
          } catch (e: any) {
            return { error: 'Database search error: ' + e.message }
          }
        },
      }),
      generateDiscount: tool({
        description: 'Kullanıcıyı ikna etmek veya satış kapatmak için özel bir indirim kuponu oluşturur.',
        parameters: z.object({
          discountPercentage: z.number().describe('İndirim yüzdesi (10 ile 25 arası)'),
          reason: z.string().describe('İndirim verme sebebi (müşteriye söylenecek)')
        }),
        execute: async ({ discountPercentage }: any) => {
          try {
            if (!canGiveDiscount) {
              return { error: 'Şu anda sistem tarafından indirim kodu oluşturulmasına izin verilmiyor.' }
            }
            
            const actualDiscount = Math.min(discountPercentage, discountLimit)
            
            const code = 'PN' + Math.random().toString(36).substring(2, 8).toUpperCase()
            await prisma.coupon.create({
              data: {
                code,
                discount_type: 'percentage',
                value: actualDiscount,
                is_ai_generated: true,
                usage_limit: 1,
              }
            })
            return { code, discountPercentage: actualDiscount, message: 'İndirim kodu başarıyla üretildi.' }
          } catch (e: any) {
            return { error: 'Coupon creation error: ' + e.message }
          }
        }
      })
    },
    maxSteps: 3
  }).then(result => {
    const allToolResults = result.steps?.flatMap(step => step.toolResults) || []
    writer.write(encoder.encode(JSON.stringify({ text: result.text, toolResults: allToolResults })))
  }).catch(err => {
    console.error("Chat API Error:", err)
    writer.write(encoder.encode(JSON.stringify({ 
      text: 'Şu anda sistemlerimizde yoğunluk var. Lütfen birkaç dakika sonra tekrar deneyin.', 
      toolResults: [] 
    })))
    writer.close()
  })

  return new Response(stream.readable, { headers: { 'Content-Type': 'application/json' } })
}
