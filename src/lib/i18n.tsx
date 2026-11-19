'use client'

// Mağaza dil altyapısı (çerezle dil değişimi; adresler değişmez).
// Varsayılan Türkçe; çerez "pn_lang" = tr | en | ar. Türkiye dışı IP'lerde ilk girişte
// middleware.ts çerezi "en" olarak yazar. Metinler satır içi üçlü ile verilir: t('Sepet', 'Cart', 'السلة').
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export type Lang = 'tr' | 'en' | 'ar'
export const LANG_COOKIE = 'pn_lang'
const LANGS: Lang[] = ['tr', 'en', 'ar']

function readCookie(): Lang | null {
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + LANG_COOKIE + '=([^;]*)'))
    const v = m ? decodeURIComponent(m[1]) : ''
    return (LANGS as string[]).includes(v) ? (v as Lang) : null
  } catch {
    return null
  }
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void }
const LocaleContext = createContext<Ctx>({ lang: 'tr', setLang: () => {} })

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // İlk render her zaman 'tr' (sunucu HTML'i ile aynı); çerez okununca güncellenir.
  const [cookieLang, setLangState] = useState<Lang>('tr')
  // /en ve /ar altındaki kurumsal sayfalar kendi dilindedir: menü/altbilgi de o dilde görünür.
  const pathname = usePathname() || ''
  const pathLang: Lang | null = /^\/en(\/|$)/.test(pathname) ? 'en' : /^\/ar(\/|$)/.test(pathname) ? 'ar' : null
  const lang: Lang = pathLang ?? cookieLang

  useEffect(() => {
    const c = readCookie()
    if (c) setLangState(c)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    try {
      document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    } catch {}
    setLangState(l)
  }, [])

  return <LocaleContext.Provider value={{ lang, setLang }}>{children}</LocaleContext.Provider>
}

export function useLang(): Lang {
  return useContext(LocaleContext).lang
}

export function useSetLang() {
  return useContext(LocaleContext).setLang
}

/** t(tr, en, ar): bulunamayan dilde Türkçe yerine İngilizceye düşer (ar yoksa en). */
export function useT() {
  const lang = useLang()
  return useCallback(
    (tr: string, en?: string, ar?: string) => (lang === 'en' ? en ?? tr : lang === 'ar' ? ar ?? en ?? tr : tr),
    [lang]
  )
}

/** Sunucu bileşenlerinde satır içi çeviri: <T tr="Sepet" en="Cart" ar="السلة" /> */
export function T({ tr, en, ar }: { tr: string; en?: string; ar?: string }) {
  const t = useT()
  return <>{t(tr, en, ar)}</>
}
