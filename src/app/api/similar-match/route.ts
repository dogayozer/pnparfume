import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAIModel } from '@/lib/ai-gateway'
import { generateObject } from 'ai'
import { z } from 'zod'

export const maxDuration = 30

// Maliyet kuralı: web araması YOK, en fazla 1 LLM çağrısı. Önce kendi kataloğumuzda
// (sıfır maliyetli metin eşleştirmesi) arıyoruz; eşleşme varsa müşteriye önce
// "PN {kod} bu mu?" diye onay soruyoruz (telif kuralı: marka adı asla müşteriye
// gösterilmez, sadece kendi kodumuz), eşleşme yoksa TEK bir generateObject çağrısıyla
// niyet/nota çıkarıp yine kendi kataloğumuza karşı skorluyoruz. Bu tek LLM çağrısı,
// yazım hatalarını/marka adını farklı dilde tanımayı da üstleniyor (aşağıya bakın) —
// ayrı bir "yazım kontrolü" adımı veya web araması YOK.

// Dile duyarlı şablonlar — SADECE bu LLM çağrısının kapsadığı cevaplar için (site
// geneli çeviri projesi ayrı/daha büyük bir iş, kapsam dışı). Fast-path (LLM'siz)
// yanıtlar şimdilik Türkçe kalıyor çünkü orada dil algılayacak bir LLM çağrısı yok.
const TEMPLATES: Record<string, { didYouMean: (sku: string) => string, notFound: string, results: (summary: string) => string }> = {
  tr: {
    didYouMean: (sku) => `Bahsettiğiniz koku PN ${sku} olabilir mi?`,
    notFound: "Maalesef tarif ettiğiniz özelliklerde tam bir benzerlik bulamadım. Katalog sayfamızdan tüm ürünleri inceleyebilirsiniz.",
    results: (s) => `"${s}" arayanlar için kütüphanemizden önerdiklerimiz:`
  },
  en: {
    didYouMean: (sku) => `Could you mean PN ${sku}?`,
    notFound: "We couldn't find a close match for that. Feel free to browse our full catalog.",
    results: (s) => `Our picks from the library for "${s}":`
  },
  ru: {
    didYouMean: (sku) => `Возможно, вы имеете в виду PN ${sku}?`,
    notFound: "К сожалению, точного совпадения не нашлось. Посмотрите весь каталог.",
    results: (s) => `Наши рекомендации из библиотеки для «${s}»:`
  },
  ar: {
    didYouMean: (sku) => `هل تقصد PN ${sku}؟`,
    notFound: "للأسف لم نجد تطابقًا دقيقًا. يمكنك تصفح الكتالوج الكامل.",
    results: (s) => `توصياتنا من مكتبتنا لـ "${s}":`
  }
}
const getTemplate = (lang?: string) => TEMPLATES[lang || 'tr'] || TEMPLATES.tr

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ text: "Mesaj bulunamadı." })
    }

    const lastUserMessage = messages[messages.length - 1].content

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

    const findBrandMatches = (needle: string) => {
      const needleLower = needle.toLowerCase()
      return allProducts.filter(p => p.original_name && (needleLower.includes(p.original_name.toLowerCase()) || p.original_name.toLowerCase().includes(needleLower)))
    }

    // FAST PATH: veritabanındaki original_name ile basit metin eşleşmesi (sıfır LLM/web maliyeti).
    // Not: bu birebir metin eşleşmesi — yazım hatalarını yakalamaz, onu LLM adımı yakalıyor.
    const userMsgLower = lastUserMessage.toLowerCase().trim()
    const fastMatches = findBrandMatches(lastUserMessage)

    if (fastMatches.length > 0 && userMsgLower.length > 3) {
      // Kullanıcı "Evet" deyip önerilen ismi (suggestion) geri gönderdiyse — bu, bir
      // ürünün original_name'iyle TAM eşleşir. Bu durumda onay sormadan doğrudan sonucu ver.
      const exactMatch = fastMatches.find(p => p.original_name!.toLowerCase() === userMsgLower)
      if (exactMatch) {
        const ordered = [exactMatch, ...fastMatches.filter(p => p.sku !== exactMatch.sku)]
        return NextResponse.json({
          text: `Kütüphanemizdeki en yakın koku(lar):`,
          products: ordered.slice(0, 3)
        })
      }

      // İlk kez eşleşti — sonucu göstermeden önce onay iste.
      const top = fastMatches[0]
      return NextResponse.json({
        type: 'did_you_mean',
        suggestion: top.original_name,
        text: `Bahsettiğiniz koku PN ${top.sku} olabilir mi?`,
        products: []
      })
    }

    // FAST PATH eşleşmedi → tek bir LLM çağrısıyla niyet/nota/vibe/dil çıkar (web araması yok).
    // Bu çağrı ayrıca yazım hatalarını ve farklı dilde yazılmış marka adlarını da normalize
    // ediyor — ayrı bir "yazım kontrolü" adımı veya web araması eklemeden.
    const model = getAIModel()

    const { object: intent } = await generateObject({
      model,
      schema: z.object({
        brand: z.string().nullable().describe("Kullanıcının kastettiği bilinen bir parfüm/marka adı varsa, YAZIM HATASI olsa veya başka bir dilde yazılmış olsa bile düzeltilmiş/normalize edilmiş İngilizce haliyle yaz (örn. 'sovaj' veya 'соваж' -> 'Sauvage'). Yoksa null."),
        notes: z.array(z.string()).describe("Kullanıcının istediği kokunun notalarını (limon, vanilya, odunsu vs.) bir dizi olarak yazın."),
        vibe: z.string().nullable().describe("Kullanıcının istediği genel hissiyat veya etki (ferah, ağır, seksi, vb.)."),
        language: z.string().describe("Kullanıcının mesajının yazıldığı dilin ISO 639-1 kodu (tr, en, ru, ar gibi).")
      }),
      prompt: `Kullanıcının şu parfüm arama mesajını analiz et — yazım hatası içerebilir veya Türkçe dışında bir dilde olabilir: "${lastUserMessage}"`
    })

    console.log('[SIMILAR-MATCH-DEBUG] intent =', JSON.stringify(intent))
    const t = getTemplate(intent.language)

    // LLM bir marka tanıdıysa (yazım hatası/başka dil olsa bile), kendi kataloğumuzda
    // tekrar dene — hâlâ web araması yok, sadece normalize edilmiş isimle aynı
    // ücretsiz DB eşleştirmesini tekrarlıyoruz.
    if (intent.brand) {
      const brandMatches = findBrandMatches(intent.brand)
      if (brandMatches.length > 0) {
        const top = brandMatches[0]
        return NextResponse.json({
          type: 'did_you_mean',
          suggestion: top.original_name,
          text: t.didYouMean(top.sku),
          products: []
        })
      }
    }

    const scoredProducts = allProducts.map(p => {
      let score = 0
      const pStr = `${p.top_notes} ${p.heart_notes} ${p.base_notes} ${p.fragrance_family.join(' ')} ${p.mood_tag}`.toLowerCase()

      ;(intent.notes || []).forEach(note => {
        if (pStr.includes(note.toLowerCase())) score += 2
      })
      if (intent.vibe && pStr.includes(intent.vibe.toLowerCase())) score += 1

      return { product: p, score }
    }).filter(item => item.score > 0)

    scoredProducts.sort((a, b) => b.score - a.score)
    const matchedProducts = scoredProducts.slice(0, 3).map(i => i.product)

    // Eşleşme yoksa boş döndür, rastgele ürün önerme!
    if (matchedProducts.length === 0) {
      return NextResponse.json({
        text: t.notFound,
        products: []
      })
    }

    // Deterministik şablon — ekstra bir LLM çağrısı (generateText) yapmadan sonucu sunuyoruz.
    const summary = intent.vibe || intent.notes?.[0] || 'aradığınız tarza'
    return NextResponse.json({
      text: t.results(summary),
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
