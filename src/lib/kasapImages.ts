export const PNIO_IMAGES: string[] = [
  "WhatsApp Image 2026-08-20 at 01.06.09.jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (1).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (2).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (3).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (4).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (5).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (6).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (7).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (8).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (9).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (10).jpeg",
  "WhatsApp Image 2026-08-20 at 01.06.09 (11).jpeg"
]

export const KASAP_IMAGES = PNIO_IMAGES

export function getProductKasapImage(sku: string, fallbackIndex?: number): string {
  let pos = 0
  if (typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
    pos = fallbackIndex % PNIO_IMAGES.length
  } else {
    let hash = 0
    for (let i = 0; i < sku.length; i++) {
      hash = ((hash << 5) - hash) + sku.charCodeAt(i)
      hash |= 0
    }
    pos = Math.abs(hash) % PNIO_IMAGES.length
  }
  const filename = PNIO_IMAGES[pos]
  return `/api/kasap-image/${encodeURIComponent(filename)}`
}
