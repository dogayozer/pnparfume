import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCartCostTotal } from '@/lib/cartCost'
import { computeDynamicShipping } from '@/lib/dynamicShipping'

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

// Kâr marjı bazlı DİNAMİK kargo kararı — sabit bir TL barajı yerine, sepetin
// gerçek ürün maliyetini ve indirimler sonrası (kupon/çoklu ürün) kalan tutarı
// alıp, kargoyu işletme üstlense bile hedef minimum kâr marjının (Senaryo
// Kuralları → TARGET_PROFIT_MARGIN_PERCENT) korunup korunmadığını hesaplar.
// Korunuyorsa kargo ücretsiz, korunmuyorsa normal kargo ücreti uygulanır —
// hem "birikmiş kupon ile" hem sıradan alışverişlerde aynı kural işler.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cart, discountedSubtotal } = body

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Sepet boş' }, { status: 400 })
    }

    const cartCostTotal = await getCartCostTotal(cart)
    const result = await computeDynamicShipping(cartCostTotal, Number(discountedSubtotal) || 0)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Dynamic shipping compute error:', error)
    // Hata durumunda normal (indirimsiz) kargo ücretine düş — sepet asla kırılmasın.
    return NextResponse.json({ freeShippingEligible: false, shippingFee: 110 })
  }
}
