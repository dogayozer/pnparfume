// Pien Intense (81 ürün, 749 TL, 60 ml EDP) ve Pien Luxury (14 ürün, 2300 TL, 100 ml Extrait) içe aktarma.
// SKU = müşteriye görünen ad: "Pien Intense RX54", "Pien LUX M 13" (Excel'deki "LUX 13 M" → "Pien LUX M 13").
// Kullanım (DATABASE_URL ortam değişkeni olarak verilmelidir; .env OKUNMAZ):
//   npx tsx scripts/import_intens_luxury.ts            -> yalnız Excel kuru çalıştırma (DB'ye bağlanmaz)
//   npx tsx scripts/import_intens_luxury.ts --check    -> DATABASE_URL ile salt-okunur çakışma kontrolü
//   npx tsx scripts/import_intens_luxury.ts --apply    -> yazar (yalnız bu iki koleksiyonun SKU'ları; çakışmada durur)
// Barkodlar çalışma numarasıdır (868199 serisi); veritabanında saklanır, sitede GÖSTERİLMEZ.
// Orijinal marka/ad Excel'de yok ve buraya da alınmaz. Görseller: sahibi parfumtasarla.com'a yükler; --apply bundan sonra çalıştırılmalı.
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as xlsx from 'xlsx'
import path from 'path'

const APPLY = process.argv.includes('--apply')
const CHECK = process.argv.includes('--check') || APPLY
const FILE = path.resolve('c:/pnio/yeni resim üretme/lux/pnparfume_koleksiyon_aktarim.xlsx')

const toArray = (s: unknown) => String(s || '').split(/[\/|]/).map((x) => x.trim()).filter(Boolean)
const gender = (g: unknown) => (String(g || '').toLowerCase().includes('kad') ? 'Kadın' : String(g || '').toLowerCase().includes('erkek') ? 'Erkek' : 'Unisex')
// ProductCard/Gallery http://parfumtasarla.com adreslerini media-proxy'ye yönlendirir
const httpUrl = (u: unknown) => String(u || '').trim().replace(/^https:\/\/parfumtasarla\.com/, 'http://parfumtasarla.com')

// Excel Luxury kodu "LUX 13 M" / "LUX 12 W" / "LUX 7 UNI" → sahibi biçimi "Pien LUX M 13" / "Pien LUX W 12" / "Pien LUX UNI 7"
export function luxurySku(raw: string): string | null {
  const m = raw.trim().match(/^LUX (\d+) (M|W|UNI)$/)
  return m ? `Pien LUX ${m[2]} ${m[1]}` : null
}

async function main() {
  const wb = xlsx.readFile(FILE)
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Ürünler']) as any[]
  console.log(`${rows.length} satır. Mod: ${APPLY ? 'YAZ' : CHECK ? 'KONTROL' : 'KURU'}`)

  const items: any[] = []
  const seenSku = new Set<string>()
  const seenBarcode = new Set<string>()
  const problems: string[] = []
  for (const row of rows) {
    const coll = String(row['Koleksiyon'] || '').trim()
    const rawSku = String(row['SKU'] || '').trim()
    const barcode = String(row['Barkod'] || '').trim()
    let sku: string | null
    let price: number
    // Excel'de "Pien Intens …" yazılmış; sahibi kararı (2026-11-24): doğru yazım "Intense" → "Pien Intense …"
    if (coll === 'Intens') { sku = /^Pien Intens [A-Z0-9]+( [0-9]+)?$/.test(rawSku) ? rawSku.replace(/^Pien Intens /, 'Pien Intense ') : null; price = 749 }
    else if (coll === 'Luxury') { sku = luxurySku(rawSku); price = 2300 }
    else { problems.push(`bilinmeyen koleksiyon: "${coll}" (${rawSku})`); continue }
    if (!sku || !/^\d{13}$/.test(barcode)) { problems.push(`geçersiz SKU/barkod: ${rawSku} ${barcode}`); continue }
    if (parseInt(String(row['Satış Fiyatı (TL)'])) !== price) problems.push(`fiyat uyuşmuyor: ${sku} ${row['Satış Fiyatı (TL)']}`)
    if (seenSku.has(sku) || seenBarcode.has(barcode)) problems.push(`Excel içinde tekrar: ${sku} ${barcode}`)
    seenSku.add(sku); seenBarcode.add(barcode)
    const images = [row['Görsel 1 URL (hero)'], row['Görsel 2 URL (kutu+şişe)'], row['Görsel 3 URL (özellikler)']].map(httpUrl).filter(Boolean)
    if (images.length !== 3) problems.push(`görsel eksik: ${sku}`)
    const g = gender(row['Cinsiyet'])
    if (/ M \d+$/.test(sku) && g === 'Kadın') problems.push(`cinsiyet uyumsuz: ${sku} ${g}`)
    if (/ W \d+$/.test(sku) && g === 'Erkek') problems.push(`cinsiyet uyumsuz: ${sku} ${g}`)
    items.push({
      sku, price, images, coll,
      data: {
        barcode, original_name: sku, seo_name: sku, gender: g,
        fragrance_family: toArray(row['Koku Ailesi']),
        top_notes: row['Üst Notalar'] || 'Gizli Formül',
        heart_notes: row['Kalp Notalar'] || 'Gizli Formül',
        base_notes: row['Dip Notalar'] || 'Gizli Formül',
        mood_tag: row['Duygu / İzlenim'] || 'Etkileyici',
        persona_tag: row['Karakter'] || 'Modern',
        status_tag: 'Lüks',
        bottle_aesthetic_tag: 'Minimalist',
        season_tag: row['Mevsim'] || 'Dört Mevsim',
        time_of_day_tag: row['Zaman'] || 'Gündüz / Gece',
        occasion_tag: row['Mekan'] || 'Günlük',
        longevity_score: 8, sillage_score: 8, gift_safe_score: 7,
        age_focus: 'Tüm Yaşlar', content_tag: 'Standart',
        is_featured: false,
      },
    })
  }
  const count = (c: string) => items.filter((x) => x.coll === c).length
  console.log(`geçerli: ${items.length} (Intense ${count('Intens')}, Luxury ${count('Luxury')})`)
  console.log(`örnek: ${items[0]?.sku} | ${items.find((x) => x.coll === 'Luxury')?.sku} | ${items[0]?.images[0]}`)
  if (problems.length) { console.log('SORUNLAR:\n' + problems.join('\n')); process.exit(1) }
  if (!CHECK) return

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ortam değişkeni gerekli')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  try {
    const skus = items.map((x) => x.sku)
    const barcodes = items.map((x) => x.data.barcode)
    const bySku = await prisma.product.findMany({ where: { sku: { in: skus } }, select: { sku: true } })
    const byBarcode = await prisma.product.findMany({ where: { barcode: { in: barcodes } }, select: { sku: true, barcode: true } })
    const foreign = byBarcode.filter((p: any) => !skus.includes(p.sku))
    console.log(`DB: aynı SKU'lu mevcut ${bySku.length}, başka ürüne ait barkod çakışması ${foreign.length}`)
    if (foreign.length) { console.log('ÇAKIŞMA:', foreign.map((p: any) => `${p.sku}(${p.barcode})`).join(', ')); process.exit(1) }
    if (!APPLY) return
    for (const it of items) {
      await prisma.product.upsert({ where: { sku: it.sku }, update: it.data, create: { sku: it.sku, ...it.data } })
      await prisma.marketplaceListing.upsert({
        where: { productId_platform: { productId: it.sku, platform: 'trendyol' } },
        update: { price: it.price, marketPrice: null, stock: 100, images: it.images },
        create: { productId: it.sku, platform: 'trendyol', price: it.price, stock: 100, images: it.images },
      })
    }
    console.log(`yazıldı: ${items.length}`)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
