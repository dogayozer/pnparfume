// @ts-nocheck
import { google } from '@ai-sdk/google'
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

KURALLAR:
1. Kullanıcılar sana genellikle bildikleri (diğer markalara ait) ünlü parfümlerin veya tasarımcı kokularının isimlerini yazacaktır.
2. Kullanıcının yazdığı orijinal kokunun notalarını ve tarzını anla, ardından "searchProducts" aracını kullanarak kendi veritabanımızdan buna en yakın koku ailesini veya ruh halini ara.
3. Kullanıcıya bizim parfümümüzü önerirken ŞU ŞABLONU KULLAN: "Koku kütüphanemizde tarzınıza ve aradığınız koku profiline uygun şu ürünlerimiz var, tam sizlik:"
4. Asla telif hakkı ihlali yapma. Bizim ürünümüzün diğer markanın "birebir kopyası" olduğunu SÖYLEME. Sadece "aradığınız o şık ve odunsu havayı veren, tarzınıza çok uygun bir parfümümüz var" şeklinde benzetme yap.
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
    model: google('gemini-1.5-flash-latest'),
    system: systemPrompt,
    messages,
    tools: {
      searchProducts: tool({
        description: 'Veritabanında parfüm araması yapar. Kullanıcının ruh haline, içeriğe veya isme göre filtreleme yapabilirsiniz.',
        parameters: z.object({
          query: z.string().describe('Arama terimi (Örn: odunsu, ferah, gül)'),
          gender: z.string().optional().describe('Cinsiyet filtresi (Erkek, Kadın, Unisex)')
        }),
        execute: async ({ query, gender }: any) => {
          try {
            const products = await prisma.product.findMany({
              where: {
                OR: [
                  { sku: { contains: query, mode: 'insensitive' } },
                  { mood_tag: { contains: query, mode: 'insensitive' } },
                  { persona_tag: { contains: query, mode: 'insensitive' } },
                  { fragrance_family: { has: query } }
                ],
                ...(gender ? { gender: { equals: gender, mode: 'insensitive' } } : {})
              },
              take: 3,
              select: { sku: true, original_name: true, gender: true, fragrance_family: true, mood_tag: true }
            })
            
            return products.length > 0 ? products : { error: 'Kriterlere uygun ürün bulunamadı.' }
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
    writer.close()
  }).catch(err => {
    writer.write(encoder.encode(JSON.stringify({ text: 'Hata: ' + (err?.message || String(err)), toolResults: [] })))
    writer.close()
  })

  return new Response(stream.readable, { headers: { 'Content-Type': 'application/json' } })
}
