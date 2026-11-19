// Türkçe kurumsal sayfaların /en ve /ar karşılıkları (middleware yönlendirmesi ve dil menüsü kullanır).
// [tr, en, ar] — sırasıyla. Dijital bayilik yalnız Türkçe olduğundan EN/AR karşılığı bayilik sayfasıdır.
export type Lang3 = 'tr' | 'en' | 'ar'
const IDX: Record<Lang3, number> = { tr: 0, en: 1, ar: 2 }

const PAIRS: [string, string, string][] = [
  ['/kurumsal/girisimcilere-ozel', '/en/entrepreneurs', '/ar/entrepreneurs'],
  ['/kurumsal/markalarimiz', '/en/brands', '/ar/brands'],
  ['/kurumsal/bayilik', '/en/dealership', '/ar/dealership'],
  ['/kurumsal/distributorluk', '/en/distributor', '/ar/distributor'],
  ['/kurumsal/kurumsal-kimlik', '/en/about', '/ar/about'],
  ['/kurumsal/iletisim', '/en/contact', '/ar/contact'],
  ['/kendi-parfum-markani-yarat', '/en/private-label', '/ar/private-label'],
  ['/kurumsal/distributorluk', '/en/wholesale', '/ar/wholesale'],
]

const norm = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p)

/** Verilen yolun, istenen dildeki karşılığı (yoksa null). */
export function alternatePath(pathname: string, lang: Lang3): string | null {
  const p = norm(pathname)
  if (p === '/kurumsal/bayilik/dijital') return lang === 'tr' ? p : PAIRS[2][IDX[lang]]
  for (const pair of PAIRS) {
    if (pair.includes(p)) return pair[IDX[lang]]
  }
  return null
}

/** Türkçe bir kurumsal sayfa için EN/AR karşılığı (middleware); Türkçe için null. */
export function trToLang(pathname: string, lang: Lang3): string | null {
  if (lang === 'tr') return null
  const p = norm(pathname)
  if (p === '/kurumsal/bayilik/dijital') return PAIRS[2][IDX[lang]]
  for (const pair of PAIRS) {
    if (pair[0] === p) return pair[IDX[lang]]
  }
  return null
}
