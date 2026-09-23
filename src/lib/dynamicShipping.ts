import { prisma } from '@/lib/prisma'

// Kargo kuralı: sabit, tanıtılabilir bir TL barajı — Senaryo Kuralları →
// FREE_SHIPPING_LIMIT ve SHIPPING_COST üzerinden yönetilir (admin panelinden
// değiştirilebilir). Maliyet koruması ayrıca /api/paytr/token'daki
// MIN_PROFIT_MARGIN_PERCENT sunucu tarafı kontrolüyle sağlanıyor (sipariş
// tutarı hiçbir zaman gerçek ürün maliyetinin altına düşemez) — bu yüzden
// kargo eşiği burada basit tutulabiliyor, ayrıca marj hesabı yapmasına gerek yok.
export async function computeDynamicShipping(cartCostTotal: number, discountedSubtotal: number) {
  const rules = await prisma.scenarioRule.findMany({
    where: { rule_key: { in: ['FREE_SHIPPING_LIMIT', 'SHIPPING_COST'] } }
  })
  const byKey = Object.fromEntries(rules.filter(r => r.is_active).map(r => [r.rule_key, r.rule_value]))

  const freeShippingLimit = byKey.FREE_SHIPPING_LIMIT ?? 1000
  const shippingFeeIfCharged = byKey.SHIPPING_COST ?? 120

  const freeShippingEligible = discountedSubtotal >= freeShippingLimit

  return {
    freeShippingEligible,
    shippingFee: freeShippingEligible ? 0 : shippingFeeIfCharged,
    shippingFeeIfCharged,
    freeShippingLimit
  }
}
