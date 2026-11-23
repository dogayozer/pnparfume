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
export function secondItemDiscount(lines: { price: number; quantity: number }[]): number {
  const sorted = [...lines].filter((l) => l.quantity > 0 && l.price > 0).sort((a, b) => b.price - a.price)
  if (sorted.length === 0) return 0
  const second = sorted[0].quantity >= 2 ? sorted[0].price : sorted[1]?.price
  return second ? Math.floor((second * SECOND_ITEM_DISCOUNT_PERCENT) / 100) : 0
}
