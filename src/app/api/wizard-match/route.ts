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

      // Occasion filter (naive mapping)
      if (filters.occasion && filters.occasion !== 'Farketmez' && p.occasion_tag) {
        const occLower = filters.occasion.toLowerCase()
        const pOccLower = p.occasion_tag.toLowerCase()
        
        let hasMatch = false
        if (occLower.includes('günlük') && (pOccLower.includes('günlük') || pOccLower.includes('gündüz'))) hasMatch = true
        else if (occLower.includes('gece') && (pOccLower.includes('gece') || pOccLower.includes('davet'))) hasMatch = true
        else if (occLower.includes('ofis') && (pOccLower.includes('ofis') || pOccLower.includes('iş'))) hasMatch = true
        else if (occLower.includes('spor') && (pOccLower.includes('spor') || pOccLower.includes('dinamik'))) hasMatch = true
        else if (occLower.includes('romantik') && (pOccLower.includes('romantik') || pOccLower.includes('randevu'))) hasMatch = true
        
        if (!hasMatch) match = false
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
        text: `Seçimlerinize (${filters.family || 'Farketmez'}, ${filters.occasion || 'Farketmez'}, ${filters.gender || 'Farketmez'}) tam olarak uyan bir ürün bulamadım. Ancak [Katalog](/katalog) sayfamızda diğer harika kokularımızı keşfedebilirsiniz!`, 
        products: [] 
      })
    }

    // Sort randomly and take top 3
    matched = matched.sort(() => 0.5 - Math.random()).slice(0, 3)

    // 4. LLM Call: Very short presentation (budget optimized)
    const prompt = `Kullanıcı aşağıdaki filtrelere göre parfüm arıyor:
Cinsiyet: ${filters.gender}
Etkinlik: ${filters.occasion}
Koku Ailesi: ${filters.family}

Sistemde eşleşen şu 1-3 parfümü buldum:
${matched.map(p => `- PN ${p.sku} (Notalar: ${p.top_notes}, ${p.heart_notes}, ${p.base_notes})`).join('\n')}

GÖREV: Sadece bu ürünleri ön plana çıkaran 2-3 cümlelik çok kısa ve cezbedici bir öneri yaz. Ürünlerin kodlarını ve birkaç notayı mentionla.
KESİN KURAL: Barkod, fiyat veya stok gibi bilgiler verme. Listenin çok uzun olmamasını sağla.`;

    const model = getAIModel();
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 250,
      temperature: 0.7,
    });

    return NextResponse.json({ 
      text: text, 
      products: matched 
    })

  } catch (error) {
    console.error('Wizard Match API Error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
