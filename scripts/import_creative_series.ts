// Pien Creative (PN Creative Series) 25 ürünü içe aktarır.
// Varsayılan: kuru çalıştırma (veritabanına YAZMAZ). Yazmak için: npx tsx scripts/import_creative_series.ts --apply
// Orijinal marka adı sütunu (D) bilerek ALINMAZ; original_name/seo_name "Pien Creative {SKU}" olur.
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as xlsx from 'xlsx'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const APPLY = process.argv.includes('--apply')
const PRICE = 1490
const STOCK = 98
const IMAGE_BASE = 'http://parfumtasarla.com/piencreative' // ProductCard/Gallery http:// -> media-proxy kuralıyla uyumlu
const FILE = path.resolve('c:/pnio/yeni resim üretme/web-yuklenecek/PN_Creative_Series_25_urun.xlsx')

function toArray(str: unknown): string[] {
  if (!str) return []
  return String(str).split(/[\/|]/).map((s) => s.trim()).filter(Boolean)
}
function gender(g: unknown): string {
  const s = String(g || '').toLowerCase()
  if (s.includes('kad') || s.includes('kız') || s.includes('kiz')) return 'Kadın'
  if (s.includes('erkek')) return 'Erkek'
  return 'Unisex'
}
const num = (v: unknown, d: number) => parseInt(String(v)) || d

async function main() {
  const wb = xlsx.readFile(FILE)
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Ürünler']) as any[]
  console.log(`${rows.length} satır okundu. Mod: ${APPLY ? 'YAZ (--apply)' : 'KURU ÇALIŞTIRMA'}`)

  let prisma: PrismaClient | null = null
  let pool: Pool | null = null
  if (APPLY) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
    prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  }

  for (const row of rows) {
    const sku = String(row['Parfüm Kodu (SKU)'] || '').trim()
    const barcode = String(row['barkod'] || '').trim()
    if (!sku.startsWith('CS-') || !barcode) { console.log('ATLANDI (SKU/barkod eksik):', sku, barcode); continue }

    const name = `Pien Creative ${sku}`
    const data = {
      barcode,
      original_name: name,
      seo_name: name,
      gender: gender(row['Cinsiyet Eğilimi']),
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
      is_featured: true, // Ana sayfa "Çok Satanlar"
    }
    const images = [1, 2, 3].map((n) => `${IMAGE_BASE}/${barcode}_${n}.jpg`) // ürün, kutulu, tanıtım

    if (!APPLY) { console.log(`[kuru] ${sku} | ${barcode} | ${data.gender} | ${PRICE} TL | ${images[0]}`); continue }

    await prisma!.product.upsert({ where: { sku }, update: data, create: { sku, ...data } })
    await prisma!.marketplaceListing.upsert({
      where: { productId_platform: { productId: sku, platform: 'trendyol' } },
      update: { price: PRICE, marketPrice: null, stock: STOCK, images },
      create: { productId: sku, platform: 'trendyol', price: PRICE, stock: STOCK, images },
    })
    console.log('yazıldı:', sku)
  }

  if (prisma) await prisma.$disconnect()
  if (pool) await pool.end()
}

main().catch((e) => { console.error(e); process.exit(1) })
