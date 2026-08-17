import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAIModel } from '@/lib/ai-gateway'
import { generateText } from 'ai'

export const maxDuration = 30; // 30 seconds

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { filters } = body

    if (!filters) {
      return NextResponse.json({ text: "Filtreler eksik.", products: [] })
    }

    // 1. Fetch all active products
    const allProducts = await prisma.product.findMany({
      where: { publish_status: { not: 'DRAFT' } },
      select: {
        sku: true,
        gender: true,
        fragrance_family: true,
        occasion_tag: true,
        season_tag: true,
        top_notes: true,
        heart_notes: true,
        base_notes: true,
        mood_tag: true
      }
    })

    // 2. Filter in memory (as requested by brief: pure code filter)
    let matched = allProducts.filter(p => {
      let match = true

      // Gender filter
      if (filters.gender && filters.gender !== 'Farketmez') {
        if (p.gender !== filters.gender && p.gender !== 'Unisex') {
          match = false
        }
      }

      // Family filter
      if (filters.family && filters.family !== 'Farketmez' && p.fragrance_family) {
        const famLower = filters.family.toLowerCase()
        const famMatch = p.fragrance_family.some(f => f.toLowerCase().includes(famLower.split('/')[0].trim()))
        if (!famMatch) match = false
      }

      return match
    })

    // 3. Fallback: If 0 matches, return static text and link
    if (matched.length === 0) {
      return NextResponse.json({ 
        text: `Bu kriterlere (${filters.family || 'Farketmez'}, ${filters.gender || 'Farketmez'}) tam uyan bir ürün bulamadım, ama katalogda daha fazla seçenek görebilirsin: https://pnparfume.com/katalog`, 
        products: [] 
      })
    }

    // Sort randomly and take up to 12 to allow local filtering
    matched = matched.sort(() => 0.5 - Math.random()).slice(0, 12)

    // 4. LLM Call: Very short presentation without listing all 12 products
    const prompt = `Kullanıcı aşağıdaki filtrelere göre parfüm arıyor:
Cinsiyet: ${filters.gender}
Koku Ailesi: ${filters.family}

Sistemde toplam ${matched.length} ürün bulundu.
GÖREV: Kullanıcıya bu ürünleri sunduğunu belirten sıcak, 1-2 cümlelik çok kısa bir giriş mesajı yaz.
KESİN KURAL: Asla ürün kodlarını veya notaları listeleme! Sadece "İşte size uygun olabilecek X ürün. Dilerseniz aşağıdaki butonlardan daraltma yapabilirsiniz." tarzında doğal bir giriş yaz.`;

    const model = getAIModel();
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 150,
      temperature: 0.7,
    });

    return NextResponse.json({ 
      text: text, 
      products: matched 
    })

  } catch (error) {
    console.error('Wizard Match API Error:', error)
    return NextResponse.json({ 
      text: 'Şu anda sistemlerimizde yoğunluk var. Lütfen birkaç dakika sonra tekrar deneyin.', 
      products: [] 
    })
  }
}
