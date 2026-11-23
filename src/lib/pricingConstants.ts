// Sepet fiyat kuralları — hem tarayıcıdaki sepet/ürün sayfaları hem ödeme ucundaki
// sunucu tarafı yeniden hesaplama bu tek kaynaktan okur; ikisi farklılaşırsa
// ödeme "fiyatlar güncellendi" hatasıyla reddedilir.
export const EXTRAIT_SURCHARGE = 200
export const DISCOVERY_BOX_SKU = 'DISCOVERY-5X10'
export const DISCOVERY_BOX_PRICE = 690
export const BLEND_SAMPLE_10ML_PRICE = 200
// Kampanya: 2. ürün %50 indirimde. Siparişte BİR kez uygulanır: en pahalı iki birimden ikincisinin
// (yani ucuz olanın) yarısı. Aynı üründen 2 adet de "2. ürün" sayılır. Bayi fiyatlarına uygulanmaz.
export const SECOND_ITEM_DISCOUNT_PERCENT = 50
export function secondItemDiscount(lines: { price: number; quantity: number }[], percent: number = SECOND_ITEM_DISCOUNT_PERCENT): number {
  const sorted = [...lines].filter((l) => l.quantity > 0 && l.price > 0).sort((a, b) => b.price - a.price)
  if (sorted.length === 0) return 0
  const second = sorted[0].quantity >= 2 ? sorted[0].price : sorted[1]?.price
  return second ? Math.floor((second * percent) / 100) : 0
}

// Kişiye özel "1 alana 1 bedava" kuponu: sepette en az 2 birim varsa ucuz olan (2. en pahalı birim) %100 indirimli.
// Otomatik 2. ürün %50 kampanyasının YERİNE geçer (ikisi toplanmaz). Bayilere uygulanmaz.
export const BOGO_COUPON_TYPE = 'bogo'

export type CouponInput = { type: string; value: number }

// Sepet sayfası, yan sepet ve ödeme ucu aynı hesabı bu fonksiyondan okur (farklılaşırsa ödeme reddedilir).
export function cartDiscounts(opts: { lines: { price: number; quantity: number }[]; isDealer: boolean; coupon?: CouponInput | null }) {
  const { lines, isDealer, coupon } = opts
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  if (coupon?.type === BOGO_COUPON_TYPE) {
    const free = isDealer ? 0 : secondItemDiscount(lines, 100)
    return { subtotal, multiItemDiscount: 0, couponDiscount: free, couponApplies: free > 0 }
  }
  const multiItemDiscount = !isDealer ? secondItemDiscount(lines) : 0
  const couponDiscount = !coupon ? 0
    : coupon.type === 'percentage' ? Math.floor(subtotal * (coupon.value / 100))
    : coupon.value
  return { subtotal, multiItemDiscount, couponDiscount, couponApplies: !!coupon && couponDiscount > 0 }
}
