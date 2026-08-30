import { prisma } from '@/lib/prisma'

// Sepetteki ürünlerin gerçek toplam maliyetini (base_cost × adet) hesaplar. Hem
// PayTR ödeme başlatma uç noktasındaki minimum maliyet korumasında hem de
// kâr marjı bazlı dinamik kargo kararında kullanılıyor — tek, ortak kaynak.
export async function getCartCostTotal(cart: any[]): Promise<number> {
  if (!Array.isArray(cart) || cart.length === 0) return 0
  const skus = cart.map((item: any) => (item.sku || item.id || '').toString()).filter(Boolean)
  if (skus.length === 0) return 0

  const dbProducts = await prisma.product.findMany({
    where: { sku: { in: skus } },
    select: { sku: true, base_cost: true }
  })
  const costBySku = Object.fromEntries(dbProducts.map(p => [p.sku, p.base_cost]))

  return cart.reduce((sum: number, item: any) => {
    const sku = (item.sku || item.id || '').toString()
    const qty = Number(item.quantity) || 1
    return sum + (costBySku[sku] || 0) * qty
  }, 0)
}
