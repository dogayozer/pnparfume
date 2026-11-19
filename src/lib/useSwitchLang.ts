'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSetLang, type Lang } from '@/lib/i18n'
import { alternatePath } from '@/lib/pagePairs'

/** Dili değiştirir; bulunulan sayfanın o dildeki karşılığı (örn. /kurumsal/bayilik ↔ /en/dealership) varsa oraya gider. */
export function useSwitchLang() {
  const setLang = useSetLang()
  const pathname = usePathname()
  const router = useRouter()
  return (lang: Lang) => {
    setLang(lang)
    const alt = alternatePath(pathname, lang)
    if (alt && alt !== pathname) router.push(alt)
  }
}
