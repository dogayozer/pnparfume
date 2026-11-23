'use client'

import { useEffect } from 'react'

// Ürün sayfası görüntülenmesini (dolayısıyla tester/karekod tıklamalarını)
// saymak için görünmez bir izleyici. Sadece bir kere, mount olduğunda tetiklenir.
export default function ViewTracker({ sku }: { sku: string }) {
  useEffect(() => {
    // Neon maliyeti: botlar ve aynı oturumda aynı ürünün tekrar açılması sayılmaz/yazılmaz.
    if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent)) return
    const key = `pn_view_${sku}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // sessionStorage kapalıysa yine de say.
    }
    fetch(`/api/products/${encodeURIComponent(sku)}/view`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      // Sayaç kaybı kritik değil, sayfa deneyimini asla bozmasın.
    })
  }, [sku])

  return null
}
