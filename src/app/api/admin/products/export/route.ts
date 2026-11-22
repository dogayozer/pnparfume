import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { collectionScope, getCollection, getCollectionBySku } from '@/lib/collections'
import { buildWorkbook, type ExportProduct, type FormulaRow } from '@/lib/productExcel'

const STOREFRONT_PLATFORM = 'trendyol'

// GET /api/admin/products/export?collection=<slug|all> → .xlsx (Ürünler + Formül sayfaları)
export async function GET(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  const slug = new URL(req.url).searchParams.get('collection') || 'all'
  let where: Record<string, unknown> = {}
  if (slug !== 'all') {
    const collection = getCollection(slug)
    if (!collection) return NextResponse.json({ error: 'Geçersiz koleksiyon' }, { status: 400 })
    where = collectionScope(collection)
  }

  const items = await prisma.product.findMany({
    where,
    orderBy: { sku: 'asc' },
    include: { marketplaceListings: true, ingredients: { include: { ingredient: true } } },
  })

  const products: ExportProduct[] = []
  const formulas: FormulaRow[] = []
  for (const p of items) {
    const l = p.marketplaceListings.find((x) => x.platform === STOREFRONT_PLATFORM)
    products.push({
      sku: p.sku,
      koleksiyon: getCollectionBySku(p.sku)?.name ?? 'PN',
      barkod: p.barcode ?? undefined,
      seo_name: p.seo_name ?? undefined,
      publish_status: p.publish_status,
      gender: p.gender,
      is_featured: p.is_featured,
      is_on_sale: p.is_on_sale,
      top_notes: p.top_notes,
      heart_notes: p.heart_notes,
      base_notes: p.base_notes,
      base_cost: p.base_cost,
      dealer_price: p.dealer_price ?? undefined,
      fiyat: l?.price,
      piyasa_fiyati: l?.marketPrice ?? undefined,
      stok: l?.stock,
      gorsel_1: l?.images?.[0],
      gorsel_2: l?.images?.[1],
      gorsel_3: l?.images?.[2],
    })
    // Standart dışı katmanlı (Üst/Kalp/Dip dışı) satırı olan ürünün formülü dosyaya yazılmaz:
    // eksik satırla geri yüklenip kalıcı silinmesin diye o ürünün formülü Excel'den yönetilmez.
    if (p.ingredients.some((pi) => pi.layer !== 'Üst' && pi.layer !== 'Kalp' && pi.layer !== 'Dip')) continue
    for (const pi of p.ingredients) {
      const katman = pi.layer as FormulaRow['katman']
      formulas.push({ sku: p.sku, hammadde: pi.ingredient.name, katman, katman_yuzde: pi.layer_weight_pct, mutlak_yuzde: pi.absolute_weight_pct })
    }
  }

  const buf = buildWorkbook(products, formulas)
  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="urunler-${slug}-${date}.xlsx"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
