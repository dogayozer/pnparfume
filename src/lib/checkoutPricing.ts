import { prisma } from '@/lib/prisma'
import { BOTTLE_OPTIONS } from '@/lib/bottleOptions'
import { computeDealerPrice } from '@/lib/dealerPrice'
import { getDealerDiscountPercent } from '@/lib/dealerPricing'
import { computeDynamicShipping } from '@/lib/dynamicShipping'
import {
  EXTRAIT_SURCHARGE, DISCOVERY_BOX_SKU, DISCOVERY_BOX_PRICE,
  BLEND_SAMPLE_10ML_PRICE, SECOND_ITEM_DISCOUNT
} from '@/lib/pricingConstants'

// Ödeme ucunda sepetin sunucu tarafında yeniden fiyatlandırılması. Tarayıcıdan gelen
// fiyatlara güvenilmez: her kalemin fiyatı veritabanından (ve bayiyse bayi fiyatından)
// yeniden hesaplanır. Kalem tipleri sepete ekleyen bileşenlerle birebir eşleşir:
//   "M 3"                → ProductCard / ProductActions / sohbet asistanı
//   "M 3-EXTRAIT-pn50"   → ProductActions özelleştirme paneli
//   "MIX-AB12"           → Blend Engine (mix/engine)
//   "MIX-AB12-10ML"      → Blend Engine 10ml numune
//   "DISCOVERY-5X10"     → 5'li keşif kutusu

export interface PricedLine {
  sku: string
  name: string
  quantity: number
  size?: string
  selectedScents?: string[]
  imageUrl?: string
  unitPrice: number
  // Sepetin "fiyatlar güncellendi" durumunda senkronlanacağı perakende fiyat (bayi fiyatı değil).
  retailPrice: number
}

export type CartPricingError =
  | { code: 'UNAVAILABLE_ITEM'; sku: string }
  | { code: 'EMPTY_CART' }

const CONFIG_SKU = /^(.+)-(EDP|EXTRAIT)-([a-z0-9]+)$/
const BLEND_SAMPLE_SKU = /^MIX-[A-Z0-9]+-10ML$/
const BLEND_SKU = /^MIX-[A-Z0-9]+$/
const SCENT_ENTRY = /^PN (.+) \(%(\d+)\)$/

export async function priceCart(cart: any[], isDealer: boolean): Promise<{ lines: PricedLine[] } | { error: CartPricingError }> {
  if (!Array.isArray(cart) || cart.length === 0) return { error: { code: 'EMPTY_CART' } }

  // Fiyatı gereken tüm ürün SKU'larını tek sorguda çek.
  const neededSkus = new Set<string>()
  for (const item of cart) {
    const sku = String(item?.sku ?? '')
    const config = sku.match(CONFIG_SKU)
    if (config) neededSkus.add(config[1])
    else if (BLEND_SKU.test(sku)) {
      for (const s of item.selectedScents || []) {
        const m = String(s).match(SCENT_ENTRY)
        if (m) neededSkus.add(m[1])
      }
    } else if (sku !== DISCOVERY_BOX_SKU && !BLEND_SAMPLE_SKU.test(sku)) neededSkus.add(sku)
  }

  const [products, dealerPercent] = await Promise.all([
    prisma.product.findMany({
      where: { sku: { in: [...neededSkus] } },
      select: {
        sku: true,
        base_cost: true,
        dealer_price: true,
        publish_status: true,
        marketplaceListings: { where: { platform: 'trendyol' }, select: { price: true } }
      }
    }),
    isDealer ? getDealerDiscountPercent() : Promise.resolve(0)
  ])
  const bySku = new Map(products.map(p => [p.sku, p]))
  const available = (sku: string) => {
    const p = bySku.get(sku)
    return p && p.publish_status !== 'DRAFT' && p.publish_status !== 'OUT_OF_STOCK' ? p : null
  }
  const retailOf = (p: { base_cost: number; marketplaceListings: { price: number }[] }) =>
    p.marketplaceListings[0]?.price || p.base_cost

  const lines: PricedLine[] = []
  for (const item of cart) {
    const sku = String(item?.sku ?? '')
    const quantity = Math.max(1, Math.floor(Number(item?.quantity) || 1))
    let retailPrice: number
    let unitPrice: number

    const config = sku.match(CONFIG_SKU)
    if (sku === DISCOVERY_BOX_SKU) {
      retailPrice = unitPrice = DISCOVERY_BOX_PRICE
    } else if (BLEND_SAMPLE_SKU.test(sku)) {
      retailPrice = unitPrice = BLEND_SAMPLE_10ML_PRICE
    } else if (config) {
      const p = available(config[1])
      const bottle = BOTTLE_OPTIONS.find(b => b.code === config[3])
      if (!p || !bottle) return { error: { code: 'UNAVAILABLE_ITEM', sku } }
      retailPrice = unitPrice = retailOf(p) + (config[2] === 'EXTRAIT' ? EXTRAIT_SURCHARGE : 0) + bottle.price
    } else if (BLEND_SKU.test(sku)) {
      // Blend fiyatı tarayıcıda esans oranlarına ve şişeye göre hesaplanıyor; oranlar
      // sepette tam sayıya yuvarlanmış durduğu için ±10 TL tolerans bırakılıp taban
      // uygulanıyor. Şişe, kalemin "size" metnindeki şişe adından okunuyor; eski
      // sepetlerde (şişe adı yoksa) o hacimdeki en ucuz şişe varsayılıyor.
      let essenceTotal = 0
      const scents: string[] = item.selectedScents || []
      for (const s of scents) {
        const m = String(s).match(SCENT_ENTRY)
        const p = m ? available(m[1]) : null
        if (!m || !p) return { error: { code: 'UNAVAILABLE_ITEM', sku } }
        essenceTotal += retailOf(p) * (Number(m[2]) / 100)
      }
      const size = String(item.size || '')
      const volume = Number(size.match(/(\d+)\s*ml/i)?.[1])
      const namedBottle = BOTTLE_OPTIONS.find(b => b.volumeMl === volume && size.includes(b.label))
      const bottlePrices = namedBottle ? [namedBottle.price] : BOTTLE_OPTIONS.filter(b => b.volumeMl === volume).map(b => b.price)
      if (scents.length === 0 || bottlePrices.length === 0) return { error: { code: 'UNAVAILABLE_ITEM', sku } }
      const floor = Math.round(essenceTotal / 10) * 10 + Math.min(...bottlePrices) - 10
      const clientPrice = Number(item.price) || 0
      retailPrice = unitPrice = Math.max(clientPrice, floor)
    } else {
      const p = available(sku)
      if (!p) return { error: { code: 'UNAVAILABLE_ITEM', sku } }
      retailPrice = retailOf(p)
      unitPrice = isDealer ? computeDealerPrice(retailPrice, p.dealer_price, p.base_cost, dealerPercent) : retailPrice
    }

    lines.push({
      sku,
      name: String(item.name || `PN ${sku}`),
      quantity,
      size: item.size,
      selectedScents: item.selectedScents,
      imageUrl: item.imageUrl,
      unitPrice,
      retailPrice
    })
  }

  return { lines }
}

export type CouponResult = { ok: true; discount: number; couponId: string } | { ok: false }

// /api/checkout/coupon ile aynı geçerlilik kuralları; indirim her zaman GÜNCEL ara toplamdan hesaplanır.
export async function evaluateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  if (!coupon || !coupon.is_active) return { ok: false }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { ok: false }
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return { ok: false }
  const discount = coupon.discount_type === 'percentage'
    ? Math.floor(subtotal * (coupon.value / 100))
    : coupon.value
  return { ok: true, discount, couponId: coupon.id }
}

// "Paydaş Ekonomisi": ücretsiz kargo sadece gerçekten var olan, iptal edilmemiş bir
// siparişin koduyla birleştirildiğinde geçerli (önceden 5 karakterden uzun her metin geçiyordu).
export async function isValidFriendOrder(code: string): Promise<boolean> {
  const order = await prisma.order.findFirst({
    where: { orderNumber: { equals: code.trim(), mode: 'insensitive' }, status: { not: 'cancelled' } },
    select: { id: true }
  })
  return !!order
}

export function computeTotals(lines: PricedLine[], isDealer: boolean) {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const multiItemDiscount = lines.length >= 2 && !isDealer ? SECOND_ITEM_DISCOUNT : 0
  return { subtotal, multiItemDiscount }
}

export async function computeShippingFee(discountedSubtotal: number, friendOrderValid: boolean) {
  if (friendOrderValid) return 0
  const { shippingFee } = await computeDynamicShipping(0, discountedSubtotal)
  return shippingFee
}
