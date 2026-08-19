// @ts-nocheck
import { getAIModel } from '@/lib/ai-gateway'
import { generateText, tool } from 'ai'
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

  if (record.count >= 20) { // max 20 messages per minute
    return false
  }

  record.count += 1
  return true
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip'
    if (!checkChatRateLimit(ip)) {
      return new Response(JSON.stringify({ 
        text: 'Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.', 
        toolResults: [] 
      }), { status: 429, headers: { 'Content-Type': 'application/json' } })
    }

    const { messages } = await req.json()

    // Fetch AI Config from DB
    const config = await prisma.aiConfig.findFirst()
    
    let systemPrompt = config?.system_prompt || `Sen PN Parfüm'ün Kişisel Koku Uzmanı ve Yapay Zeka Satış Asistanısın. 
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

    if (config?.active_campaign) {
      systemPrompt += `\n\nAKTİF KAMPANYA:\n${config.active_campaign}`
    }

    const canGiveDiscount = config?.can_give_discount ?? true
    const discountLimit = config?.discount_limit ?? 20

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    
    // Send space immediately for fast response
    writer.write(encoder.encode(" "))

    generateText({
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
                  original_name: true, 
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
                    original_name: true, 
                    gender: true, 
                    fragrance_family: true, 
                    mood_tag: true,
                    top_notes: true,
                    heart_notes: true,
                    base_notes: true
                  }
                })
              }

              // Enrich with image and price
              return products.map(p => ({
                ...p,
                price: 850,
                image: getProductKasapImage(p.sku)
              }))
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
            try {
              if (!canGiveDiscount) {
                return { error: 'İndirim tanımlanamıyor' }
              }
              
              // 🔴 Hard enforce server-side discount cap
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
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
                }
              })

              return { 
                code, 
                discountPercentage: actualDiscount, 
                reason: reason || 'Aura Özel İndirimi',
                message: `Size özel %${actualDiscount} indirim kuponunuz: ${code}`
              }
            } catch (e: any) {
              return { error: 'Kupon hatası: ' + e.message }
            }
          }
        })
      },
      maxSteps: 3
    }).then(result => {
      const allToolResults = result.steps?.flatMap(step => step.toolResults) || []
      writer.write(encoder.encode(JSON.stringify({ text: result.text, toolResults: allToolResults })))
      writer.close()
    }).catch(err => {
      console.error("Chat API Error:", err)
      writer.write(encoder.encode(JSON.stringify({ 
        text: 'Size yardımcı olmaktan mutluluk duyarım. Hangi koku tarzını tercih edersiniz? (Örn: Odunsu, Ferah, Çiçeksi veya Tatlı)', 
        toolResults: [] 
      })))
      writer.close()
    })

    return new Response(stream.readable, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Chat root error:', error)
    return new Response(JSON.stringify({ text: 'Bir bağlantı hatası oluştu. Lütfen tekrar deneyin.' }), { status: 500 })
  }
}
