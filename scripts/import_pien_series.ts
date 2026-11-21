// Pien Serisi (275 ürün) içe aktarma. SKU "Pien M 1" / "Pien W 37" biçimindedir.
// Kullanım (DATABASE_URL ortam değişkeni olarak verilmelidir; .env OKUNMAZ):
//   npx tsx scripts/import_pien_series.ts            -> yalnız Excel kuru çalıştırma (DB'ye bağlanmaz)
//   npx tsx scripts/import_pien_series.ts --check    -> DATABASE_URL ile salt-okunur çakışma kontrolü
//   npx tsx scripts/import_pien_series.ts --apply    -> yazar (PN ürünlerine dokunmaz, çakışmada durur)
// "Orijinal Adı / İlham Alınan Profil" sütunu bilerek ALINMAZ (marka güvenliği).
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as xlsx from 'xlsx'
import path from 'path'

const APPLY = process.argv.includes('--apply')
const CHECK = process.argv.includes('--check') || APPLY
const PRICE = 599
const FEATURED_EVERY = 69 // 275 üründen 4 vitrin ürünü (sıra 10, 79, 148, 217)
const FILE = path.resolve('c:/pnio/yeni resim üretme/pien-series/siteye-hazir/Pien_Koleksiyonu_275_urun.xlsx')

const toArray = (s: unknown) => String(s || '').split(/[\/|]/).map((x) => x.trim()).filter(Boolean)
const gender = (g: unknown) => (String(g || '').toLowerCase().includes('kad') ? 'Kadın' : String(g || '').toLowerCase().includes('erkek') ? 'Erkek' : 'Unisex')
const num = (v: unknown, d: number) => parseInt(String(v)) || d
// ProductCard/Gallery http://parfumtasarla.com adreslerini media-proxy'ye yönlendirir
const httpUrl = (u: unknown) => String(u || '').trim().replace(/^https:\/\/parfumtasarla\.com/, 'http://parfumtasarla.com')

async function main() {
  const wb = xlsx.readFile(FILE)
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Ürünler']) as any[]
  const ty = xlsx.utils.sheet_to_json(wb.Sheets['trendyol']) as any[]
  const tyByBarcode = new Map(ty.map((r) => [String(r['Barkod']).trim(), r]))
  console.log(`${rows.length} ürün, ${ty.length} trendyol satırı. Mod: ${APPLY ? 'YAZ' : CHECK ? 'KONTROL' : 'KURU'}`)

  const items: any[] = []
  const seenSku = new Set<string>()
  const seenBarcode = new Set<string>()
  const problems: string[] = []
  rows.forEach((row, i) => {
    const sku = String(row['Parfüm Kodu (SKU)'] || '').trim().replace(/^Pien ([MW])(\d+)$/, 'Pien $1 $2') // "Pien W103" yazım hatasını düzelt
    const barcode = String(row['barkod'] || '').trim()
    if (!/^Pien [MW] \d+$/.test(sku) || !/^\d{13}$/.test(barcode)) { problems.push(`geçersiz SKU/barkod: ${sku} ${barcode}`); return }
    if (seenSku.has(sku) || seenBarcode.has(barcode)) problems.push(`Excel içinde tekrar: ${sku} ${barcode}`)
    seenSku.add(sku); seenBarcode.add(barcode)
    const t = tyByBarcode.get(barcode)
    const images = t ? [t['Görsel 1'], t['Görsel 2'], t['Görsel 3']].map(httpUrl).filter(Boolean) : []
    if (images.length !== 3) problems.push(`görsel eksik: ${sku}`)
    const g = gender(row['Cinsiyet Eğilimi'])
    // M/W kodu ile Unisex eğilimi farklı olabilir (PN'deki gibi Unisex korunur); yalnız zıt cinsiyet hatadır
    if ((sku.startsWith('Pien M') && g === 'Kadın') || (sku.startsWith('Pien W') && g === 'Erkek')) problems.push(`cinsiyet uyumsuz: ${sku} ${g}`)
    const name = sku // sahibi kararı: "Pien M 1" biçimi
    items.push({
      sku, images, stock: num(t?.['Ürün Stok Adedi'], 100),
      data: {
        barcode, original_name: name, seo_name: name, gender: g,
        fragrance_family: toArray(row['Koku Ailesi (Normalize Dizi)'] || row['Koku Ailesi']),
        top_notes: row['Üst Notalar'] || 'Gizli Formül',
        heart_notes: row['Kalp Notalar'] || 'Gizli Formül',
        base_notes: row['Dip Notalar'] || 'Gizli Formül',
        mood_tag: row['Bıraktığı İzlenim / Duygu (Nöropazarlama)'] || 'Etkileyici',
        persona_tag: row['Karakter / Persona'] || 'Modern',
        status_tag: row['Sosyal Statü Algısı'] || 'Lüks',
        bottle_aesthetic_tag: row['Şişe / Tasarım Estetiği'] || 'Minimalist',
        season_tag: row['Mevsimsellik'] || 'Dört Mevsim',
        time_of_day_tag: row['Kullanım Zamanı'] || 'Gündüz / Gece',
        occasion_tag: row['Etkinlik / Mekan'] || 'Günlük',
        longevity_score: num(row['Kalıcılık Skoru (1-10)'], 7),
        sillage_score: num(row['Silaj / Yayılım Skoru (1-10)'], 7),
        gift_safe_score: num(row['Kör Alış / Hediyelik Skoru (1-10)'], 7),
        age_focus: row['Yaş Grubu Odaklanması'] || 'Tüm Yaşlar',
        content_tag: row['İçerik Şeffaflığı (Hassasiyet vb.)'] || 'Standart',
        is_featured: i % FEATURED_EVERY === 10,
      },
    })
  })
  const m = items.filter((x) => x.sku.startsWith('Pien M')).length
  console.log(`geçerli: ${items.length} (erkek ${m}, kadın ${items.length - m}), vitrin: ${items.filter((x) => x.data.is_featured).map((x) => x.sku).join(', ')}`)
  console.log(`örnek: ${items[0].sku} | ${items[0].data.barcode} | ${items[0].images[0]}`)
  if (problems.length) { console.log('SORUNLAR:\n' + problems.join('\n')); process.exit(1) }

  if (!CHECK) return
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ortam değişkeni gerekli')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  try {
    const skus = items.map((x) => x.sku)
    const barcodes = items.map((x) => x.data.barcode)
    const bySku = await prisma.product.findMany({ where: { sku: { in: skus } }, select: { sku: true, barcode: true } })
    const byBarcode = await prisma.product.findMany({ where: { barcode: { in: barcodes } }, select: { sku: true, barcode: true } })
    const foreign = byBarcode.filter((p: any) => !p.sku.startsWith('Pien '))
    const prefixed = await prisma.product.count({ where: { sku: { startsWith: 'Pien ' } } })
    console.log(`DB: aynı SKU'lu mevcut ${bySku.length}, 'Pien ' ön ekli toplam ${prefixed}, PN tarafında barkod çakışması ${foreign.length}`)
    if (foreign.length) { console.log('ÇAKIŞMA:', foreign.map((p: any) => p.sku).join(', ')); process.exit(1) }
    if (!APPLY) return
    for (const it of items) {
      await prisma.product.upsert({ where: { sku: it.sku }, update: it.data, create: { sku: it.sku, ...it.data } })
      await prisma.marketplaceListing.upsert({
        where: { productId_platform: { productId: it.sku, platform: 'trendyol' } },
        update: { price: PRICE, marketPrice: null, stock: it.stock, images: it.images },
        create: { productId: it.sku, platform: 'trendyol', price: PRICE, stock: it.stock, images: it.images },
      })
    }
    console.log(`yazıldı: ${items.length}`)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
