import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as xlsx from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting Trendyol Data Synchronization...')

  // Find the exact Excel file using fs
  const dirFiles = fs.readdirSync('C:\\pnio')
  const excelFileName = dirFiles.find(f => f.includes('barkodlu-') && f.endsWith('_web.xlsx'))
  
  if (!excelFileName) {
    throw new Error('Excel file not found!')
  }
  const filePath = path.join('C:\\pnio', excelFileName)
  console.log(`Reading Excel: ${filePath}`)

  const workbook = xlsx.readFile(filePath)
  
  // ==========================================
  // PHASE 1: Update barcodes in Product table
  // ==========================================
  console.log('\n--- PHASE 1: Updating Barcodes ---')
  const masterSheetName = workbook.SheetNames[0] // "Ürünler"
  const masterSheet = workbook.Sheets[masterSheetName]
  const masterData = xlsx.utils.sheet_to_json<any>(masterSheet)

  let productsUpserted = 0
  for (const row of masterData) {
    const keys = Object.keys(row)
    const skuKey = keys.find(k => k.toLowerCase().includes('sku')) || keys[1]
    const sku = String(row[skuKey]).trim()
    if (!sku || sku === 'undefined') continue

    const barkodKey = keys.find(k => k.toLowerCase().includes('barkod')) || keys[0]
    const barcode = row[barkodKey] ? String(row[barkodKey]).trim() : null
    
    // Find keys ignoring encoding issues
    const originalNameKey = keys.find(k => k.includes('Orijinal') || k.includes('lham')) || keys[2]
    const genderKey = keys.find(k => k.includes('Cinsiyet')) || keys[3]
    const familyKey = keys.find(k => k.includes('Ailesi')) || keys[4]
    const topNotesKey = keys.find(k => k.includes('st Notalar')) || keys[5]
    const heartNotesKey = keys.find(k => k.includes('Kalp Notalar')) || keys[6]
    const baseNotesKey = keys.find(k => k.includes('Dip Notalar')) || keys[7]
    const moodKey = keys.find(k => k.includes('zlenim') || k.includes('Duygu')) || keys[9]
    const personaKey = keys.find(k => k.includes('Karakter') || k.includes('Persona')) || keys[10]
    const statusKey = keys.find(k => k.includes('Sosyal Stat')) || keys[11]
    const bottleKey = keys.find(k => k.includes('Tasar') || k.includes('Esteti')) || keys[12]
    const seasonKey = keys.find(k => k.includes('Mevsimsellik')) || keys[13]
    const timeKey = keys.find(k => k.includes('Kullan') || k.includes('Zaman')) || keys[14]
    const occasionKey = keys.find(k => k.includes('Etkinlik') || k.includes('Mekan')) || keys[15]
    const longevityKey = keys.find(k => k.includes('Kalc') || k.includes('Skoru')) || keys[16]
    const sillageKey = keys.find(k => k.includes('Yaylm') || k.includes('Silaj')) || keys[17]
    const giftKey = keys.find(k => k.includes('Hediyelik') || k.includes('Kör')) || keys[18]
    const ageKey = keys.find(k => k.includes('Ya') || k.includes('Odakl')) || keys[19]
    const contentKey = keys.find(k => k.includes('Hassasiyet') || k.includes('effafl')) || keys[20]

    const parseScore = (val: any) => {
      const parsed = parseInt(val)
      return isNaN(parsed) ? 5 : parsed
    }

    const dataObj = {
      barcode: barcode,
      original_name: String(row[originalNameKey] || 'Bilinmiyor'),
      gender: String(row[genderKey] || 'Unisex'),
      fragrance_family: row[familyKey] ? String(row[familyKey]).split(',').map(s => s.trim()) : [],
      top_notes: String(row[topNotesKey] || 'Gizli Formül'),
      heart_notes: String(row[heartNotesKey] || 'Gizli Formül'),
      base_notes: String(row[baseNotesKey] || 'Gizli Formül'),
      mood_tag: String(row[moodKey] || 'Bilinmiyor'),
      persona_tag: String(row[personaKey] || 'Bilinmiyor'),
      status_tag: String(row[statusKey] || 'Bilinmiyor'),
      bottle_aesthetic_tag: String(row[bottleKey] || 'Bilinmiyor'),
      season_tag: String(row[seasonKey] || 'Bilinmiyor'),
      time_of_day_tag: String(row[timeKey] || 'Bilinmiyor'),
      occasion_tag: String(row[occasionKey] || 'Bilinmiyor'),
      longevity_score: parseScore(row[longevityKey]),
      sillage_score: parseScore(row[sillageKey]),
      gift_safe_score: parseScore(row[giftKey]),
      age_focus: String(row[ageKey] || 'Bilinmiyor'),
      content_tag: String(row[contentKey] || 'Standart')
    }

    try {
      await prisma.product.upsert({
        where: { sku: sku },
        update: dataObj,
        create: {
          sku: sku,
          ...dataObj
        }
      })
      productsUpserted++
      if (productsUpserted % 50 === 0) {
        console.log(`Progress: Upserted ${productsUpserted} products...`)
      }
    } catch (e) {
      console.error(`Error upserting product SKU ${sku}:`, e)
    }
  }
  console.log(`Successfully upserted ${productsUpserted} products.`)

  // ==========================================
  // PHASE 2: Insert/Update Trendyol Listings
  // ==========================================
  console.log('\n--- PHASE 2: Importing Trendyol Listings ---')
  const trendyolSheet = workbook.Sheets['trendyol']
  if (!trendyolSheet) {
    throw new Error("Sheet 'trendyol' not found in Excel file.")
  }

  const trendyolData = xlsx.utils.sheet_to_json<any>(trendyolSheet)
  let listingsUpserted = 0

  for (const row of trendyolData) {
    const barcode = row['Barkod'] ? String(row['Barkod']).trim() : null
    if (!barcode) continue

    // Find the product by barcode
    const product = await prisma.product.findUnique({
      where: { barcode: barcode }
    })

    if (!product) {
      // Skip if product not found by barcode
      continue
    }

    // Extract images
    const images = []
    for (let i = 1; i <= 8; i++) {
      const img = row[`Görsel ${i}`]
      if (img && typeof img === 'string' && img.startsWith('http')) {
        images.push(img.trim())
      }
    }

    const trendyolPrice = parseFloat(row["Trendyol'da Satılacak Fiyat (KDV Dahil)"]) || 0
    const marketPrice = parseFloat(row["Piyasa Satış Fiyatı (KDV Dahil)"]) || null
    const stock = parseInt(row["Ürün Stok Adedi"]) || 0
    const url = row["Trendyol.com Linki"] ? String(row["Trendyol.com Linki"]).trim() : null
    const desc = row["Ürün Açıklaması"] ? String(row["Ürün Açıklaması"]).trim() : null

    const productName = row["Ürün Adı"] ? String(row["Ürün Adı"]).trim() : null
    const durum = row["Durum"] ? String(row["Durum"]).trim() : null
    
    let publishStatus = "ACTIVE"
    if (durum === "Ürün arşivlendi" || durum === "Çoklanan Ürün Satışı") {
      publishStatus = "OUT_OF_STOCK"
    }

    try {
      // Update Product with new status and SEO name
      await prisma.product.update({
        where: { sku: product.sku },
        data: {
          seo_name: productName,
          publish_status: publishStatus
        }
      })
      await prisma.marketplaceListing.upsert({
        where: {
          productId_platform: {
            productId: product.sku,
            platform: 'trendyol'
          }
        },
        update: {
          price: trendyolPrice,
          marketPrice: marketPrice,
          stock: stock,
          url: url,
          images: images,
          description: desc
        },
        create: {
          productId: product.sku,
          platform: 'trendyol',
          price: trendyolPrice,
          marketPrice: marketPrice,
          stock: stock,
          url: url,
          images: images,
          description: desc
        }
      })
      listingsUpserted++
      if (listingsUpserted % 50 === 0) {
        console.log(`Progress: Upserted ${listingsUpserted} listings...`)
      }
    } catch (e) {
      console.error(`Error upserting trendyol listing for SKU ${product.sku}:`, e)
    }
  }
  
  console.log(`Successfully synced ${listingsUpserted} trendyol listings.`)

  // Set DRAFT status for any product without a barcode
  const draftUpdate = await prisma.product.updateMany({
    where: { barcode: null },
    data: { publish_status: "DRAFT" }
  })
  console.log(`Set ${draftUpdate.count} products without barcode to DRAFT status.`)

  console.log('Trendyol Data Synchronization Complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
