'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { FREE_SHIPPING_FOR_ALL } from '@/lib/shippingCampaign'

// Açılış reklamı (2. ürün %50 + ücretsiz kargo). Kurallar:
// - Oturum başına BİR kez (sessionStorage); kapatınca ya da tıklayınca tekrar çıkmaz.
// - Yalnız Türkçe ziyaretçilere: görsel Türkçe ve kargo kampanyası Türkiye içi.
// - Yalnız oturuma ANA SAYFADAN girenlere (alışveriş niyetiyle siteye gelen) ve yalnız ana sayfada gösterilir.
//   Bir bağlantıyla doğrudan ürün/kurumsal/B2B sayfasına gelenlere, kurumsal siteyi gezenlere ve
//   arkadaş/elçi davet bağlantısıyla (?ref=) gelenlere hiç çıkmaz.
// - Sayfa açıldıktan ~1,5 sn sonra gelir (içeriği hemen kapatmaz).
// - Masaüstünde 16:9, mobilde 9:16 görsel. Kapatma: X, Esc ya da arka plana tık.
const SEEN_KEY = 'pn_opening_ad_seen'
const LANDING_KEY = 'pn_session_landing'
const DELAY_MS = 1500

export default function OpeningAd() {
  const lang = useLang()
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!FREE_SHIPPING_FOR_ALL || lang !== 'tr') return
    try {
      // Oturumun İLK sayfası kaydedilir; ana sayfa değilse bu oturumda reklam hiç çıkmaz.
      let landing = sessionStorage.getItem(LANDING_KEY)
      if (!landing) { landing = pathname; sessionStorage.setItem(LANDING_KEY, landing) }
      if (landing !== '/' || pathname !== '/') return
      if (sessionStorage.getItem(SEEN_KEY)) return
    } catch { return }
    if (/[?&]ref=/i.test(window.location.search)) return
    const timer = setTimeout(() => {
      try { sessionStorage.setItem(SEEN_KEY, '1') } catch {}
      setOpen(true)
    }, DELAY_MS)
    return () => clearTimeout(timer)
  }, [lang, pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kampanya: 2. ürün %50 indirimli, ücretsiz kargo"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6"
      onClick={() => setOpen(false)}
    >
      <div className="relative max-h-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Kapat"
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 flex items-center justify-center shadow-lg"
        >
          <X size={20} />
        </button>
        <Link href="/katalog" onClick={() => setOpen(false)} className="block rounded-2xl overflow-hidden shadow-2xl">
          <picture>
            <source media="(min-width: 768px)" srcSet="/kampanya/acilis-masaustu-16x9.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kampanya/acilis-mobil-9x16.jpg"
              alt="2. ürün yüzde 50 indirimli ve ücretsiz kargo: Pien Luxury parfüm kampanyası, pnparfume.com"
              className="block w-auto h-auto max-w-full max-h-[85vh] md:max-w-[min(90vw,1100px)]"
            />
          </picture>
        </Link>
      </div>
    </div>
  )
}
