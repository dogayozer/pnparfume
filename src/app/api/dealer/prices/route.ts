import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'
import { getDealerDiscountPercent } from '@/lib/dealerPricing'
import { computeDealerPrice } from '@/lib/dealerPrice'

// Bayi fiyatları sayfa HTML'ine hiç basılmıyor; sadece admin panelinden bayi
// statüsü verilmiş, geçerli oturum token'ı taşıyan müşteriye bu uçtan dönüyor.
export async function GET(req: Request) {
  const auth = requireCustomer(req)
  if (!auth) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const customer = await prisma.customer.findUnique({ where: { id: auth.id }, select: { is_dealer: true } })
  if (!customer?.is_dealer) return NextResponse.json({ error: 'Bayi değil' }, { status: 403 })

  const [percent, products] = await Promise.all([
    getDealerDiscountPercent(),
    prisma.product.findMany({
      where: { publish_status: { not: 'DRAFT' } },
      select: {
        sku: true,
        base_cost: true,
        dealer_price: true,
        marketplaceListings: { where: { platform: 'trendyol' }, select: { price: true } }
      }
    })
  ])

  const prices: Record<string, number> = {}
  for (const p of products) {
    const retail = p.marketplaceListings[0]?.price || p.base_cost
    if (!retail) continue
    prices[p.sku] = computeDealerPrice(retail, p.dealer_price, p.base_cost, percent)
  }

  return NextResponse.json({ prices, discountPercent: percent }, { headers: { 'Cache-Control': 'private, no-store' } })
}
