import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Blend Engine'in uyumluluk skoru için: bir ürünün üst/kalp/dip katmanındaki
// hammaddelerini ailesi ve ağırlığıyla döner. urun/[sku]/page.tsx'teki aynı
// ilişkiyi (ingredients -> ingredient) kullanır, sadece sade bir liste halinde.
export async function GET(req: Request, { params }: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await params

    const product = await prisma.product.findUnique({
      where: { sku: decodeURIComponent(sku) },
      include: {
        ingredients: {
          include: { ingredient: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    const ingredients = product.ingredients.map(pi => ({
      layer: pi.layer,
      family: pi.ingredient.family,
      absolute_weight_pct: pi.absolute_weight_pct
    }))

    return NextResponse.json({ sku: product.sku, ingredients })
  } catch (error) {
    console.error('Fetch product ingredients error:', error)
    return NextResponse.json({ error: 'Hammadde verisi alınamadı' }, { status: 500 })
  }
}
