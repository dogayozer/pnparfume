import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Blend Engine'in "Notalarını Ayarla" öneri motoru için: TÜM kataloğun
// aile-ağırlık vektörünü tek sorguda döner. /api/products/[sku]/ingredients'ı
// 300+ kez çağırmak yerine, öneri motoru tüm kütüphaneyi tek seferde tarar.
export async function GET() {
  try {
    const rows = await prisma.productIngredient.findMany({
      select: {
        productId: true,
        absolute_weight_pct: true,
        ingredient: { select: { family: true } }
      }
    })

    const profiles: Record<string, Record<string, number>> = {}
    for (const row of rows) {
      const sku = row.productId
      const family = row.ingredient.family
      if (!profiles[sku]) profiles[sku] = {}
      profiles[sku][family] = (profiles[sku][family] || 0) + row.absolute_weight_pct
    }

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Fetch family profiles error:', error)
    return NextResponse.json({ error: 'Aile profilleri alınamadı' }, { status: 500 })
  }
}
