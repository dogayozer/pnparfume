// @ts-nocheck
import { google } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

    const result = streamText({
    model: google('gemini-1.5-flash'),
    system: `Sen PN Parfüm'ün Kişisel Koku Uzmanı ve Yapay Zeka Asistanısın. 
    Adın "Aura". Müşterilerle son derece kibar, lüks ve premium bir dille konuşuyorsun.
    Küçük bir sohbet penceresinde (widget) hizmet veriyorsun, bu yüzden mesajların ÇOK KISA, net ve vurucu olmalı.
    
    KURALLAR:
    1. Kullanıcılar sana genellikle bildikleri (diğer markalara ait) ünlü parfümlerin veya tasarımcı kokularının isimlerini yazacaktır.
    2. Kullanıcının yazdığı orijinal kokunun notalarını ve tarzını anla, ardından "searchProducts" aracını kullanarak kendi veritabanımızdan buna en yakın koku ailesini veya ruh halini ara.
    3. Kullanıcıya bizim parfümümüzü önerirken ŞU ŞABLONU KULLAN: "Koku kütüphanemizde tarzınıza ve aradığınız koku profiline uygun şu ürünlerimiz var, tam sizlik:"
    4. Asla telif hakkı ihlali yapma. Bizim ürünümüzün diğer markanın "birebir kopyası" olduğunu SÖYLEME. Sadece "aradığınız o şık ve odunsu havayı veren, tarzınıza çok uygun bir parfümümüz var" şeklinde benzetme yap.
    5. Bir parfümü överken daima SKU kodunu ver (Örn: "Size PN A001'i öneriyorum").
    6. Müşteri indirim veya fırsat sorarsa "generateDiscount" aracını kullan.
    
    MİX ENGINE (KARIŞTIRMA):
    Kullanıcı iki farklı parfümü üst üste sıkmak isterse veya "bunu neyle kombinleyebilirim" derse; bir parfümün üst notası ile diğerinin dip notasını zihninde karşılaştır ve ikna edici bir koku hikayesi uydurarak bunun mükemmel olacağını söyle.`,
    messages,
    tools: {
      searchProducts: tool({
        description: 'Veritabanında parfüm araması yapar. Kullanıcının ruh haline, içeriğe veya isme göre filtreleme yapabilirsiniz.',
        parameters: z.object({
          query: z.string().describe('Arama terimi (Örn: odunsu, ferah, gül)'),
          gender: z.string().optional().describe('Cinsiyet filtresi (Erkek, Kadın, Unisex)')
        }),
        execute: async ({ query, gender }: any) => {
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
        },
      }),
      generateDiscount: tool({
        description: 'Kullanıcıyı ikna etmek veya satış kapatmak için özel bir indirim kuponu oluşturur.',
        parameters: z.object({
          discountPercentage: z.number().describe('İndirim yüzdesi (10 ile 25 arası)'),
          reason: z.string().describe('İndirim verme sebebi (müşteriye söylenecek)')
        }),
        execute: async ({ discountPercentage }: any) => {
          const code = 'PN' + Math.random().toString(36).substring(2, 8).toUpperCase()
          await prisma.coupon.create({
            data: {
              code,
              discount_type: 'percentage',
              value: discountPercentage,
              is_ai_generated: true,
              usage_limit: 1,
            }
          })
          return { code, discountPercentage, message: 'İndirim kodu başarıyla üretildi.' }
        }
      })
    },
  })

  return result.toTextStreamResponse()
}
