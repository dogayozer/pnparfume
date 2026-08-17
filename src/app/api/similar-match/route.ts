import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAIModel } from '@/lib/ai-gateway'
import { generateText, generateObject } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ text: "Mesaj bulunamadı." })
    }

    const lastUserMessage = messages[messages.length - 1].content

    const model = getAIModel()

    // 1. Niyet Çıkarma (Intent Extraction via JSON)
    const { object: intent } = await generateObject({
      model,
      schema: z.object({
        brand: z.string().nullable().describe("Kullanıcının bahsettiği bilinen bir parfüm markası veya ismi varsa buraya yazın, yoksa null."),
        notes: z.array(z.string()).describe("Kullanıcının istediği kokunun notalarını (limon, vanilya, odunsu vs.) bir dizi olarak yazın."),
        vibe: z.string().nullable().describe("Kullanıcının istediği genel hissiyat veya etki (ferah, ağır, seksi, vb.).")
      }),
      prompt: `Kullanıcının şu parfüm arama mesajını analiz et: "${lastUserMessage}"`
    })

    const allProducts = await prisma.product.findMany({
      where: { publish_status: { not: 'DRAFT' } },
      select: {
        sku: true,
        original_name: true,
        gender: true,
        fragrance_family: true,
        top_notes: true,
        heart_notes: true,
        base_notes: true,
        mood_tag: true
      }
    })

    let matchedProducts = []

    // 2. Marka eşleşmesi (Web aramasını atlayıp direkt kendi DB'mizden ilham kaynağına bakıyoruz)
    if (intent.brand) {
      const brandLower = intent.brand.toLowerCase()
      matchedProducts = allProducts.filter(p => p.original_name && p.original_name.toLowerCase().includes(brandLower))
    }

    // 3. Eşleşme yoksa veya marka yoksa, Notalara göre KOD tabanlı benzerlik skoru hesapla
    if (matchedProducts.length === 0 && intent.notes && intent.notes.length > 0) {
      const scoredProducts = allProducts.map(p => {
        let score = 0
        const pStr = `${p.top_notes} ${p.heart_notes} ${p.base_notes} ${p.fragrance_family.join(' ')} ${p.mood_tag}`.toLowerCase()
        
        intent.notes.forEach(note => {
          if (pStr.includes(note.toLowerCase())) score += 2
        })
        if (intent.vibe && pStr.includes(intent.vibe.toLowerCase())) score += 1
        
        return { product: p, score }
      }).filter(item => item.score > 0)
      
      scoredProducts.sort((a, b) => b.score - a.score)
      matchedProducts = scoredProducts.slice(0, 3).map(i => i.product)
    }

    // Hala eşleşme yoksa rastgele 2 tane önerelim ki sistem boş dönmesin
    if (matchedProducts.length === 0) {
      matchedProducts = allProducts.sort(() => 0.5 - Math.random()).slice(0, 2)
    }

    // 4. Sonuç Sunumu (Kısa LLM Çağrısı)
    const prompt = `Kullanıcı şu tarz bir parfüm arıyor:
Mesajı: "${lastUserMessage}"
Analiz edilen niyet: Marka: ${intent.brand || '-'}, Notalar: ${intent.notes?.join(', ') || '-'}, Hissiyat: ${intent.vibe || '-'}

Sistemde eşleşen en iyi parfümler şunlar:
${matchedProducts.map(p => `- PN ${p.sku} (Notalar: ${p.top_notes}, ${p.heart_notes}, ${p.base_notes} | Aile: ${p.fragrance_family.join(', ')})`).join('\n')}

GÖREV: Kullanıcının talebine doğrudan yanıt vererek, bu ürünleri NEDEN önerdiğini belirten 2-3 cümlelik çok kısa, ikna edici ve doğal bir yanıt yaz. 
KESİN KURAL: Barkod, fiyat, stok gibi verileri asla yazma. Çok uzun listeler yapma.`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 250,
      temperature: 0.7,
    })

    return NextResponse.json({ 
      text, 
      products: matchedProducts 
    })

  } catch (error) {
    console.error('Similar Match API Error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
