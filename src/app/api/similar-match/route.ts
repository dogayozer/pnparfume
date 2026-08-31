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
const TEMPLATES: Record<string, { didYouMean: (sku: string) => string, notFound: string, results: (summary: string) => string, confirmed: string }> = {
  tr: {
    didYouMean: (sku) => `Bahsettiğiniz koku PN ${sku} olabilir mi?`,
    notFound: "Maalesef tarif ettiğiniz özelliklerde tam bir benzerlik bulamadım. Katalog sayfamızdan tüm ürünleri inceleyebilirsiniz.",
    results: (s) => `"${s}" arayanlar için kütüphanemizden önerdiklerimiz:`,
    confirmed: `Kütüphanemizdeki en yakın koku(lar):`
  },
  en: {
    didYouMean: (sku) => `Could you mean PN ${sku}?`,
    notFound: "We couldn't find a close match for that. Feel free to browse our full catalog.",
    results: (s) => `Our picks from the library for "${s}":`,
    confirmed: `Our closest match(es) from the library:`
  },
  ru: {
    didYouMean: (sku) => `Возможно, вы имеете в виду PN ${sku}?`,
    notFound: "К сожалению, точного совпадения не нашлось. Посмотрите весь каталог.",
    results: (s) => `Наши рекомендации из библиотеки для «${s}»:`,
    confirmed: `Наш самый близкий вариант из библиотеки:`
  },
  ar: {
    didYouMean: (sku) => `هل تقصد PN ${sku}؟`,
    notFound: "للأسف لم نجد تطابقًا دقيقًا. يمكنك تصفح الكتالوج الكامل.",
    results: (s) => `توصياتنا من مكتبتنا لـ "${s}":`,
    confirmed: `أقرب توصياتنا من المكتبة:`
  }
}
const getTemplate = (lang?: string) => TEMPLATES[lang || 'tr'] || TEMPLATES.tr

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, lang } = body

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
        mood_tag: true,
        base_cost: true,
        marketplaceListings: { where: { platform: 'trendyol' }, select: { images: true, price: true } }
      }
    })

    // Müşteriye giden ürün nesnesinden original_name (gerçek marka adı) HER ZAMAN
    // çıkarılır — telif kuralı: bu alan sadece sunucu tarafı eşleştirme için var,
    // ağ isteğinde bile (devtools) müşteriye görünmemeli. Gerçek fotoğraf/fiyat
    // varsa o kullanılır; yoksa ürünle alakasız bir görsel/uydurma fiyat yerine
    // image: null (ChatWidget zarifçe gösterir) ve base_cost'a düşülür.
    const toClientProduct = (p: (typeof allProducts)[number]) => {
      const listing = p.marketplaceListings?.[0]
      return {
        sku: p.sku,
        gender: p.gender,
        fragrance_family: p.fragrance_family,
        top_notes: p.top_notes,
        heart_notes: p.heart_notes,
        base_notes: p.base_notes,
        mood_tag: p.mood_tag,
        price: listing?.price || p.base_cost || 850,
        image: listing?.images?.[0] || null
      }
    }

    // Kataloğumuzda gündelik İngilizce/Türkçe konuşmada sık geçen, tek kelimelik
    // isimler var (BLUE, BOSS, WISH, BLACK, ESCAPE, ADDICT, BELIEVE, ROMA, SOIR,
    // AURA...) — bunlar HAM METİN üzerinde substring eşleşmesinde sürekli yanlış
    // pozitif üretiyor (örn. "that popular blue bottle" -> "BLUE" ile eşleşir).
    // Bu yüzden serbest metin taramasında (fast path) hariç tutuluyorlar; ama LLM
    // zaten "brand" olarak bu ismi çıkardıysa (çok daha isabetli bir sinyal) yine
    // de eşleştirmeye izin veriliyor — allowAmbiguous parametresiyle. Kataloğa
    // yeni ürün eklendikçe bu liste gözden geçirilmeli.
    const AMBIGUOUS_NAMES = new Set(['BLUE', 'BOSS', 'WISH', 'BLACK', 'ESCAPE', 'ADDICT', 'BELIEVE', 'ROMA', 'SOIR', 'BRUT', 'ENVY', 'AURA', 'CHROME'])

    const findBrandMatches = (needle: string, allowAmbiguous = false) => {
      const needleLower = needle.toLowerCase()
      // original_name en az 4 karakter olmalı — yoksa "GO", "PI", "ZEN" gibi kısa
      // isimler her mesajda ("gourmand", "logo", "zen" içeren her cümle) yanlış
      // pozitif eşleşme üretiyor.
      return allProducts.filter(p => p.original_name && p.original_name.length >= 4 &&
        (allowAmbiguous || !AMBIGUOUS_NAMES.has(p.original_name.toUpperCase())) &&
        (needleLower.includes(p.original_name.toLowerCase()) || p.original_name.toLowerCase().includes(needleLower)))
    }

    // Bağlamı geniş tutmak için: kataloğumuzda erkek/kadın versiyonları FARKLI
    // isimlerle kayıtlı olabiliyor (örn. kadın "ARMANI YOU" iken erkek karşılığı
    // "STRONGER WITH YOU" — ikisi de gerçek dünyada aynı "you" hattına ait ama
    // original_name'de ortak kelime dışında bağ yok). Türkçe konuşan kullanıcılar
    // markayı/isimi genelde eksik/farklı ifade ediyor, bu yüzden tek taraflı
    // (sadece bulunan tam eşleşmeyi) varsaymak yerine — sorgudaki anlamlı bir
    // kelimeyi paylaşan BAŞKA ürünler varsa bunları da "bunlardan biri mi?"
    // seçeneği olarak sunuyoruz, tek taraflı Evet/Hayır'a zorlamıyoruz.
    const STOPWORDS = new Set(['for', 'with', 'and', 'the', 'de', 'da', 've', 'ile', 'bir', 'pour', 'du', 'la', 'le', 'of', 'by', 'pas'])
    const tokenize = (s: string) => Array.from(new Set((s.toLowerCase().match(/[a-zçğıöşü0-9]+/g) || []).filter(t => t.length >= 3 && !STOPWORDS.has(t))))

    const findSiblingMatches = (primarySku: string, needleTokens: string[]) => {
      if (needleTokens.length === 0) return []
      return allProducts.filter(p => {
        if (p.sku === primarySku) return false
        if (!p.original_name || p.original_name.length < 4) return false
        const nameLower = p.original_name.toLowerCase()
        return needleTokens.some(tok => new RegExp(`\\b${tok}\\b`).test(nameLower))
      })
    }

    // FAST PATH: veritabanındaki original_name ile basit metin eşleşmesi (sıfır LLM/web maliyeti).
    // Not: bu birebir metin eşleşmesi — yazım hatalarını yakalamaz, onu LLM adımı yakalıyor.
    const userMsgLower = lastUserMessage.toLowerCase().trim()
    let fastMatches = findBrandMatches(lastUserMessage)

    // Serbest metinde hiç eşleşme yoksa ama mesajın TAMAMI bir ürün adına birebir
    // eşitse (örn. "Evet" onayında resubmit edilen "Blue"), bu artık belirsiz bir
    // substring değil — tam eşitlik, ambiguous isim olsa bile kabul edilir.
    if (fastMatches.length === 0 && userMsgLower.length > 0) {
      const exactAmbiguous = allProducts.find(p => p.original_name && p.original_name.toLowerCase() === userMsgLower)
      if (exactAmbiguous) fastMatches = [exactAmbiguous]
    }

    if (fastMatches.length > 0 && userMsgLower.length > 3) {
      // Kullanıcı "Evet" deyip önerilen ismi (suggestion) geri gönderdiyse — bu, bir
      // ürünün original_name'iyle TAM eşleşir. Bu durumda onay sormadan doğrudan sonucu ver.
      const exactMatch = fastMatches.find(p => p.original_name!.toLowerCase() === userMsgLower)
      if (exactMatch) {
        // "Evet" onayı burada bir önceki (LLM'li) cevabın dilini `lang` ile geri
        // taşıyor — aksi halde İngilizce/Rusça/Arapça bir onaydan sonra sonuç
        // her zaman Türkçe dönerdi (LLM'siz bu adımda dil algılama yok).
        const ordered = [exactMatch, ...fastMatches.filter(p => p.sku !== exactMatch.sku)]
        return NextResponse.json({
          text: getTemplate(lang).confirmed,
          products: ordered.slice(0, 3).map(toClientProduct)
        })
      }

      // İlk kez eşleşti — sonucu göstermeden önce onay iste. Ama önce, sorgudaki
      // anlamlı bir kelimeyi paylaşan başka (farklı isimli) bir ürün var mı diye
      // bak — varsa tek taraflı varsaymak yerine ikisini de seçenek olarak sun.
      const top = fastMatches[0]
      const siblings = findSiblingMatches(top.sku, tokenize(lastUserMessage)).slice(0, 2)

      if (siblings.length > 0) {
        const candidates = [top, ...siblings]
        return NextResponse.json({
          type: 'did_you_mean_multi',
          candidates: candidates.map(c => ({ sku: c.sku, suggestion: c.original_name, gender: c.gender })),
          text: `Bahsettiğiniz koku bunlardan biri olabilir mi?`,
          products: []
        })
      }

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

    const t = getTemplate(intent.language)

    // LLM bir marka tanıdıysa (yazım hatası/başka dil olsa bile), kendi kataloğumuzda
    // tekrar dene — hâlâ web araması yok, sadece normalize edilmiş isimle aynı
    // ücretsiz DB eşleştirmesini tekrarlıyoruz. allowAmbiguous:true çünkü LLM'in
    // marka olarak tanıması, ham metin substring taramasından çok daha isabetli.
    if (intent.brand) {
      const brandMatches = findBrandMatches(intent.brand, true)
      if (brandMatches.length > 0) {
        const top = brandMatches[0]
        const siblings = findSiblingMatches(top.sku, tokenize(intent.brand)).slice(0, 2)

        if (siblings.length > 0) {
          const candidates = [top, ...siblings]
          return NextResponse.json({
            type: 'did_you_mean_multi',
            candidates: candidates.map(c => ({ sku: c.sku, suggestion: c.original_name, gender: c.gender })),
            language: intent.language,
            text: `Bahsettiğiniz koku bunlardan biri olabilir mi?`,
            products: []
          })
        }

        return NextResponse.json({
          type: 'did_you_mean',
          suggestion: top.original_name,
          language: intent.language,
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
      products: matchedProducts.map(toClientProduct)
    })

  } catch (error) {
    console.error('Similar Match API Error:', error)
    return NextResponse.json({
      text: 'Şu anda sistemlerimizde yoğunluk var. Lütfen birkaç dakika sonra tekrar deneyin.',
      products: []
    })
  }
}
