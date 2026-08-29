import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Sepet sayfasının okuyacağı, girişsiz/herkese açık uç — sadece kargo ücreti ve
// ücretsiz kargo barajını döner (admin panelinden "Senaryo Kuralları"nda ayarlanır).
// Önceden sepet sayfası bu değerleri sabit kodlanmış olarak (100 TL / 2000 TL)
// taşıyordu, admin panelindeki FREE_SHIPPING_LIMIT kuralı hiç okunmuyordu.
export async function GET() {
  try {
    const rules = await prisma.scenarioRule.findMany({
      where: { rule_key: { in: ['SHIPPING_COST', 'FREE_SHIPPING_LIMIT'] } }
    })
    const byKey = Object.fromEntries(rules.map(r => [r.rule_key, r.rule_value]))
    return NextResponse.json({
      shippingCost: byKey.SHIPPING_COST ?? 100,
      freeShippingLimit: byKey.FREE_SHIPPING_LIMIT ?? 500
    })
  } catch (error) {
    console.error('Shipping rules fetch error:', error)
    // Hata durumunda önceki sabit kodlanmış değerlere düş — sepet sayfası asla kırılmasın.
    return NextResponse.json({ shippingCost: 100, freeShippingLimit: 500 })
  }
}
