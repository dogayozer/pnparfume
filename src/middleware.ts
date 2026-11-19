import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { trToLang } from '@/lib/pagePairs'

// Dil: mağaza adresleri değişmez, dil "pn_lang" çerezi ile seçilir (tr | en | ar).
// Çerez yoksa ve ziyaretçi Türkiye dışındaysa (Vercel'in x-vercel-ip-country başlığı)
// ilk girişte çerez "en" yazılır; kullanıcı dil menüsünden değiştirirse çerez onu hatırlar.
// Türkçe kurumsal bir sayfa (örn. /kurumsal/bayilik) İngilizce/Arapça seçiliyken açılırsa,
// o sayfanın /en veya /ar karşılığına yönlendirilir.
// Arama motoru botlarına dokunulmaz (Türkçe içerik indekslenmeye devam eder).
// Yerelde (Vercel dışı) ülke başlığı gelmez: varsayılan Türkçe kalır.
const LANG_COOKIE = 'pn_lang'
const LANGS = ['tr', 'en', 'ar'] as const
type L = (typeof LANGS)[number]

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  if (/bot|crawl|spider|slurp|facebookexternalhit|whatsapp/i.test(userAgent)) {
    return NextResponse.next()
  }

  const cookieLang = request.cookies.get(LANG_COOKIE)?.value
  const country = request.headers.get('x-vercel-ip-country')
  const hasCookie = !!cookieLang && (LANGS as readonly string[]).includes(cookieLang)
  const lang: L = hasCookie ? (cookieLang as L) : country && country !== 'TR' ? 'en' : 'tr'

  const target = trToLang(request.nextUrl.pathname, lang)
  const response = target
    ? NextResponse.redirect(new URL(target, request.url))
    : NextResponse.next()

  if (!hasCookie && lang !== 'tr') {
    response.cookies.set(LANG_COOKIE, lang, { maxAge: 60 * 60 * 24 * 365, path: '/', sameSite: 'lax' })
  }
  return response
}

// Yalnızca sayfa isteklerinde çalışır: api, _next, admin ve dosya uzantılı yollar hariç.
export const config = {
  matcher: ['/((?!api|_next|admin|.*\\..*).*)'],
}
