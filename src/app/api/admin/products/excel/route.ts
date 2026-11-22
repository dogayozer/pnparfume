import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { parseWorkbook, planChanges, blockedFormulaSkus, enforceShowcaseLimit, mergeImages, formulaKey, type ExistingProduct, type FormulaRow, type RowIssue } from '@/lib/productExcel'

const STOREFRONT_PLATFORM = 'trendyol'
const MAX_BYTES = 4 * 1024 * 1024
const LISTING_FIELDS = ['fiyat', 'piyasa_fiyati', 'stok', 'gorsel_1', 'gorsel_2', 'gorsel_3']
const PRODUCT_FIELD_MAP: Record<string, string> = {
  barkod: 'barcode', seo_name: 'seo_name', publish_status: 'publish_status', gender: 'gender',
  is_featured: 'is_featured', is_on_sale: 'is_on_sale', top_notes: 'top_notes', heart_notes: 'heart_notes',
  base_notes: 'base_notes', base_cost: 'base_cost', dealer_price: 'dealer_price',
}

// POST (FormData: file, apply='0'|'1'). apply=0 yalnız önizleme döner, hiçbir şey yazmaz.
export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file')
    const apply = form.get('apply') === '1'
    if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
    if (!/\.xlsx$/i.test(file.name)) return NextResponse.json({ error: 'Yalnızca .xlsx dosyası yüklenebilir' }, { status: 400 })
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Dosya 4 MB sınırını aşıyor' }, { status: 400 })

    const parsed = parseWorkbook(Buffer.from(await file.arrayBuffer()))
    const issues: RowIssue[] = [...parsed.issues]

    // --- Ürün alanları ---
    const skus = [...new Set(parsed.products.map((p) => p.sku))]
    const dbProducts = await prisma.product.findMany({
      where: { sku: { in: skus } },
      include: { marketplaceListings: { where: { platform: STOREFRONT_PLATFORM } } },
    })
    const listings = new Map<string, { price: number; images: string[] } | undefined>()
    const existing = new Map<string, ExistingProduct>()
    for (const p of dbProducts) {
      const l = p.marketplaceListings[0]
      listings.set(p.sku, l ? { price: l.price, images: l.images } : undefined)
      existing.set(p.sku, {
        sku: p.sku, barkod: p.barcode ?? undefined, seo_name: p.seo_name ?? undefined, publish_status: p.publish_status,
        gender: p.gender, is_featured: p.is_featured, is_on_sale: p.is_on_sale, top_notes: p.top_notes,
        heart_notes: p.heart_notes, base_notes: p.base_notes, base_cost: p.base_cost, dealer_price: p.dealer_price ?? undefined,
        fiyat: l?.price, piyasa_fiyati: l?.marketPrice ?? undefined, stok: l?.stock,
        gorsel_1: l?.images?.[0], gorsel_2: l?.images?.[1], gorsel_3: l?.images?.[2],
      })
    }
    const barkods = parsed.products.map((p) => p.barkod).filter((b): b is string => !!b)
    const owners = new Map<string, string>()
    if (barkods.length) {
      const rows = await prisma.product.findMany({ where: { barcode: { in: barkods } }, select: { sku: true, barcode: true } })
      for (const r of rows) if (r.barcode) owners.set(r.barcode, r.sku)
    }
    const plan = planChanges({ rows: parsed.products, existing, barcodeOwners: owners })
    issues.push(...plan.issues)

    // Mağaza ilanı yokken ilan alanı değişiyorsa fiyat zorunlu.
    const updates = plan.updates.filter((u) => {
      const touchesListing = Object.keys(u.changes).some((f) => LISTING_FIELDS.includes(f))
      if (touchesListing && !listings.get(u.sku) && !('fiyat' in u.changes)) {
        const row = parsed.products.find((p) => p.sku === u.sku)
        issues.push({ sheet: 'Ürünler', row: row?.row ?? 0, sku: u.sku, message: 'Mağaza ilanı yok: fiyat sütunu doldurulmalı' })
        return false
      }
      const imgChanges: Record<string, string> = {}
      for (const [f, [, next]] of Object.entries(u.changes)) if (f.startsWith('gorsel_')) imgChanges[f] = String(next)
      if (Object.keys(imgChanges).length) {
        const m = mergeImages(listings.get(u.sku)?.images ?? [], imgChanges)
        if ('error' in m) {
          const row = parsed.products.find((p) => p.sku === u.sku)
          issues.push({ sheet: 'Ürünler', row: row?.row ?? 0, sku: u.sku, message: m.error }); return false
        }
      }
      return true
    })

    // Vitrin sınırı (Çok Satanlar / İndirimde en fazla 10)
    const showcaseTouched = updates.some((u) => 'is_featured' in u.changes || 'is_on_sale' in u.changes)
    let finalUpdates = updates
    if (showcaseTouched) {
      const [featured, onSale] = await Promise.all([prisma.product.count({ where: { is_featured: true } }), prisma.product.count({ where: { is_on_sale: true } })])
      const lim = enforceShowcaseLimit(updates, { featured, onSale })
      finalUpdates = lim.updates
      for (const i of lim.issues) issues.push({ ...i, row: parsed.products.find((p) => p.sku === i.sku)?.row ?? 0 })
    }

    // --- Formül (satır numarası bilinmiyorsa 0) ---
    const blocked = blockedFormulaSkus(parsed.issues)
    const formulaSkusWithIssues = blocked.skus
    const bySku = new Map<string, FormulaRow[]>()
    if (blocked.all) issues.push({ sheet: 'Formül', row: 0, message: 'Formül sayfasında sku hücresi boş hatalı satır var: hiçbir ürünün formülü değiştirilmeyecek' })
    if (parsed.hasFormulaSheet && !blocked.all) for (const f of parsed.formulas) bySku.set(f.sku, [...(bySku.get(f.sku) ?? []), f])
    for (const s of formulaSkusWithIssues) bySku.delete(s) // hatalı satırı olan ürünün formülüne dokunulmaz
    const formulaPlans: { sku: string; before: number; after: number; rows: { ingredientId: string; f: FormulaRow }[] }[] = []
    if (bySku.size) {
      const names = [...new Set([...bySku.values()].flat().map((f) => f.hammadde))]
      const ingredients = await prisma.ingredient.findMany({ where: { name: { in: names } }, select: { id: true, name: true } })
      const idByName = new Map(ingredients.map((i) => [i.name, i.id]))
      const knownSkus = new Set((await prisma.product.findMany({ where: { sku: { in: [...bySku.keys()] } }, select: { sku: true } })).map((p) => p.sku))
      const current = await prisma.productIngredient.findMany({
        where: { productId: { in: [...bySku.keys()] } },
        include: { ingredient: { select: { name: true } } },
      })
      for (const [sku, rows] of bySku) {
        if (!knownSkus.has(sku)) { issues.push({ sheet: 'Formül', row: 0, sku, message: 'Bilinmeyen sku' }); continue }
        const missing = [...new Set(rows.filter((f) => !idByName.has(f.hammadde)).map((f) => f.hammadde))]
        if (missing.length) { issues.push({ sheet: 'Formül', row: 0, sku, message: `Bilinmeyen hammadde: ${missing.join(', ')} (formül değişmedi)` }); continue }
        for (const layer of ['Üst', 'Kalp', 'Dip'] as const) {
          const sum = rows.filter((f) => f.katman === layer).reduce((a, f) => a + f.katman_yuzde, 0)
          if (sum > 0 && Math.abs(sum - 100) > 1) issues.push({ sheet: 'Formül', row: 0, sku, message: `Uyarı: ${layer} katmanı yüzdeleri toplamı ${sum} (100 beklenir)` })
        }
        const cur = current.filter((c) => c.productId === sku).map((c) => formulaKey({ hammadde: c.ingredient.name, katman: c.layer, katman_yuzde: c.layer_weight_pct, mutlak_yuzde: c.absolute_weight_pct })).sort()
        const next = rows.map(formulaKey).sort()
        if (cur.length === next.length && cur.every((v, i) => v === next[i])) continue
        formulaPlans.push({ sku, before: cur.length, after: rows.length, rows: rows.map((f) => ({ ingredientId: idByName.get(f.hammadde)!, f })) })
      }
    }

    const rejected = issues.filter((i) => !i.message.startsWith('Uyarı')).length
    const summary = { updated: finalUpdates.length + formulaPlans.length, unchanged: parsed.products.length - plan.updates.length - plan.issues.length, rejected }
    const result = {
      applied: false, summary, updates: finalUpdates,
      formulaUpdates: formulaPlans.map(({ sku, before, after }) => ({ sku, before, after })),
      issues,
    }
    if (!apply) return NextResponse.json(result)

    await prisma.$transaction(async (tx) => {
      for (const u of finalUpdates) {
        const data: Record<string, unknown> = {}
        const listingData: Record<string, unknown> = {}
        for (const [f, [, next]] of Object.entries(u.changes)) {
          if (PRODUCT_FIELD_MAP[f]) data[PRODUCT_FIELD_MAP[f]] = next
          else if (f === 'fiyat') listingData.price = next
          else if (f === 'piyasa_fiyati') listingData.marketPrice = next
          else if (f === 'stok') listingData.stock = next
        }
        if (Object.keys(data).length) await tx.product.update({ where: { sku: u.sku }, data })
        const imageChanges = Object.entries(u.changes).filter(([f]) => f.startsWith('gorsel_'))
        if (imageChanges.length) {
          const m = mergeImages(listings.get(u.sku)?.images ?? [], Object.fromEntries(imageChanges.map(([f, [, next]]) => [f, String(next)])))
          if ('images' in m) listingData.images = m.images
        }
        if (Object.keys(listingData).length) {
          await tx.marketplaceListing.upsert({
            where: { productId_platform: { productId: u.sku, platform: STOREFRONT_PLATFORM } },
            update: listingData,
            create: {
              productId: u.sku, platform: STOREFRONT_PLATFORM, price: Number(listingData.price ?? 0),
              marketPrice: listingData.marketPrice as number | undefined, stock: Number(listingData.stock ?? 0),
              images: (listingData.images as string[]) ?? [],
            },
          })
        }
      }
      for (const fp of formulaPlans) {
        await tx.productIngredient.deleteMany({ where: { productId: fp.sku } })
        await tx.productIngredient.createMany({
          data: fp.rows.map(({ ingredientId, f }) => ({ productId: fp.sku, ingredientId, layer: f.katman, layer_weight_pct: f.katman_yuzde, absolute_weight_pct: f.mutlak_yuzde })),
        })
      }
    }, { timeout: 60000, maxWait: 10000 })

    revalidateTag('katalog', 'max')
    return NextResponse.json({ ...result, applied: true })
  } catch (error: any) {
    console.error('Excel ürün güncelleme hatası:', error)
    return NextResponse.json({ error: 'Excel işlenirken sunucu hatası oluştu' }, { status: 500 })
  }
}
