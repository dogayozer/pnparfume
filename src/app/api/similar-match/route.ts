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

    let matchedProducts: any[] = []

    // 2. Marka eşleşmesi
    if (intent.brand) {
      const brandLower = intent.brand.toLowerCase()
      matchedProducts = allProducts.filter(p => p.original_name && p.original_name.toLowerCase().includes(brandLower))
    }

    let webSearchNotes: string[] = []
    
    // 2.5 WEB SEARCH: Eğer marka varsa ama DB'mizde eşleşmediyse notalarını web'den bul
    if (intent.brand && matchedProducts.length === 0) {
      try {
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(intent.brand + ' perfume notes fragrantica basenotes')}`
        const searchRes = await fetch(searchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0' }
        })
        const html = await searchRes.text()
        const matches = [...html.matchAll(/<a class="result__snippet[^>]*>(.*?)<\/a>/gi)];
        const snippets = matches.map(m => m[1].replace(/<\/?[^>]+(>|$)/g, "")).join(' ');
        
        if (snippets.length > 50) {
          const { object: webNotes } = await generateObject({
            model,
            schema: z.object({
              notes: z.array(z.string()).describe("Arama metninden sadece koku notalarını (limon, sedir, gül vs.) çıkar")
            }),
            prompt: `Şu arama sonuçlarından parfümün notalarını çıkar: "${snippets.substring(0, 1500)}"`
          })
          if (webNotes.notes) webSearchNotes = webNotes.notes
        }
      } catch (e) {
        console.error('Web search error:', e)
      }
    }

    const allNotes = [...(intent.notes || []), ...webSearchNotes]

    // 3. Eşleşme yoksa KOD tabanlı benzerlik skoru hesapla (Kendi notalarımız + Web'den gelenler)
    if (matchedProducts.length === 0 && allNotes.length > 0) {
      const scoredProducts = allProducts.map(p => {
        let score = 0
        const pStr = `${p.top_notes} ${p.heart_notes} ${p.base_notes} ${p.fragrance_family.join(' ')} ${p.mood_tag}`.toLowerCase()
        
        allNotes.forEach(note => {
          if (pStr.includes(note.toLowerCase())) score += 2
        })
        if (intent.vibe && pStr.includes(intent.vibe.toLowerCase())) score += 1
        
        return { product: p, score }
      }).filter(item => item.score > 0)
      
      scoredProducts.sort((a, b) => b.score - a.score)
      matchedProducts = scoredProducts.slice(0, 3).map(i => i.product)
    }

    // Hala eşleşme yoksa boş döndür, rastgele ürün önerme! (Brief kuralı: Tutarlı cevap)
    if (matchedProducts.length === 0) {
      return NextResponse.json({ 
        text: "Maalesef tarif ettiğiniz özelliklerde veya markada tam bir benzerlik bulamadım. Katalog sayfamızdan tüm ürünleri inceleyebilirsiniz.", 
        products: [] 
      })
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
      temperature: 0.7,
    })

    return NextResponse.json({ 
      text, 
      products: matchedProducts 
    })

  } catch (error) {
    console.error('Similar Match API Error:', error)
    return NextResponse.json({ 
      text: 'Şu anda sistemlerimizde yoğunluk var. Lütfen birkaç dakika sonra tekrar deneyin.', 
      products: [] 
    })
  }
}
