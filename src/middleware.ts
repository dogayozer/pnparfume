import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// B2B ihracat hedefi ilk-katman Balkan pazarları (bkz. claudeparfumithalat.md,
// Bölüm 1.2 — Katman 1). Ülke kodu -> hedef sayfa. Şimdilik hepsi İngilizce
// wholesale sayfasına gidiyor (yerel dil çevirisi henüz yok); bir ülkeye özel
// çeviri hazır olduğunda burada sadece o ülkenin değerini değiştirmek yeterli
// olacak şekilde tasarlandı.
const TARGET_MARKET_REDIRECT: Record<string, string> = {
  MK: '/en/wholesale', // Kuzey Makedonya
  XK: '/en/wholesale', // Kosova (ISO'da resmi kod yok, Vercel/yaygın kullanım "XK")
  AL: '/en/wholesale', // Arnavutluk
  BA: '/en/wholesale', // Bosna Hersek
  RS: '/en/wholesale', // Sırbistan
  ME: '/en/wholesale', // Karadağ
}

const REDIRECT_COOKIE = 'pn_market_redirected'

export function middleware(request: NextRequest) {
  // Google/Bing gibi arama motoru botlarını hariç tut — bunlar genelde ABD
  // merkezli IP'lerden tarar ama yanlışlıkla eşleşirse Türkçe ana sayfanın
  // botlar için sürekli yönlendirmeye takılmasını istemiyoruz.
  const userAgent = request.headers.get('user-agent') || ''
  if (/bot|crawl|spider|slurp/i.test(userAgent)) {
    return NextResponse.next()
  }

  // Kullanıcı zaten bir kez yönlendirildiyse (veya bilerek Türkçe siteye geri
  // döndüyse — bkz. /en/wholesale'daki "Türkçe mağaza" linki) tekrar zorlama.
  if (request.cookies.has(REDIRECT_COOKIE)) {
    return NextResponse.next()
  }

  // Vercel Edge, gelen isteğin IP'sinden çözdüğü ülke kodunu bu header'a otomatik
  // ekliyor — ekstra bir paket/API çağrısı gerekmiyor. Yerelde (Vercel dışı)
  // bu header hiç gelmez, bu durumda hiçbir yönlendirme yapılmaz (varsayılan:
  // Türkçe ana sayfa).
  const country = request.headers.get('x-vercel-ip-country')
  const target = country ? TARGET_MARKET_REDIRECT[country] : undefined

  if (target) {
    const url = request.nextUrl.clone()
    url.pathname = target
    const response = NextResponse.redirect(url)
    response.cookies.set(REDIRECT_COOKIE, '1', { maxAge: 60 * 60 * 24 * 30, path: '/' }) // 30 gün
    return response
  }

  return NextResponse.next()
}

// Sadece kök sayfa girişini hedefliyoruz — ürün/kategori sayfalarına, WhatsApp'tan
// paylaşılan derin linklere veya admin/api rotalarına asla müdahale etmiyoruz.
export const config = {
  matcher: '/'
}
