'use client'

import { useEffect } from 'react'

// Ürün sayfası görüntülenmesini (dolayısıyla tester/karekod tıklamalarını)
// saymak için görünmez bir izleyici. Sadece bir kere, mount olduğunda tetiklenir.
export default function ViewTracker({ sku }: { sku: string }) {
  useEffect(() => {
    fetch(`/api/products/${encodeURIComponent(sku)}/view`, {
      method: 'POST',
      keepalive: true,
    }).catch(() => {
      // Sayaç kaybı kritik değil, sayfa deneyimini asla bozmasın.
    })
  }, [sku])

  return null
}
