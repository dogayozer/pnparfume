import { prisma } from '@/lib/prisma'

// Kargo kuralı: sabit bir TL barajı yerine, sepetin GERÇEK ürün maliyetine ve
// hedeflenen minimum kâr marjına göre kararı canlı hesaplar. "Kupon sonrası
// minimum maliyet sınırı" (paytr/token) ile aynı Kârlılık Simülatörü
// parametrelerini (TARGET_PROFIT_MARGIN_PERCENT, SIM_SHIPPING_COST_TRY)
// kullanır — admin panelinden değiştirildiğinde her ikisi de otomatik güncellenir.
//
// Mantık: kargoyu işletme üstlenip müşteriden almasa bile, ürün maliyeti +
// hedef minimum kâr + gerçek kargo maliyeti sepet tutarından karşılanıyorsa
// ("indirimli tutar" — kupon/çoklu ürün indirimi sonrası) kargo ücretsiz
// verilir. Karşılanmıyorsa normal kargo ücreti müşteriden alınır — bu durumda
// kargoyu işletme değil müşteri karşılar, marj yine korunur.
export async function computeDynamicShipping(cartCostTotal: number, discountedSubtotal: number) {
  const rules = await prisma.scenarioRule.findMany({
    where: { rule_key: { in: ['TARGET_PROFIT_MARGIN_PERCENT', 'SIM_SHIPPING_COST_TRY', 'SHIPPING_COST'] } }
  })
  const byKey = Object.fromEntries(rules.filter(r => r.is_active).map(r => [r.rule_key, r.rule_value]))

  const targetMarginPercent = byKey.TARGET_PROFIT_MARGIN_PERCENT ?? 20
  const realCargoCost = byKey.SIM_SHIPPING_COST_TRY ?? 130
  const shippingFeeIfCharged = byKey.SHIPPING_COST ?? 110

  const requiredMinProfit = cartCostTotal * (targetMarginPercent / 100)
  const breakEvenWithFreeShipping = cartCostTotal + requiredMinProfit + realCargoCost
  const freeShippingEligible = cartCostTotal > 0 && discountedSubtotal >= breakEvenWithFreeShipping

  return {
    freeShippingEligible,
    shippingFee: freeShippingEligible ? 0 : shippingFeeIfCharged,
    shippingFeeIfCharged,
    realCargoCost,
    targetMarginPercent,
    requiredMinProfit,
    breakEvenWithFreeShipping
  }
}
