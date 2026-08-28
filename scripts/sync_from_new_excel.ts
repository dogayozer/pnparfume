import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as xlsx from 'xlsx'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

function parseStringToArray(str: string | undefined): string[] {
  if (!str) return []
  return str
    .split(/[\/|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function normalizeGender(gender: string | undefined): string {
  if (!gender) return 'Unisex'
  const g = gender.trim().toLowerCase()
  if (g.includes('kad') || g.includes('kız') || g.includes('kiz')) return 'Kadın'
  if (g.includes('erkek')) return 'Erkek'
  return 'Unisex'
}

async function runInChunks<T>(items: T[], chunkSize: number, fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    await Promise.all(chunk.map(fn))
  }
}

async function main() {
  const filePath = path.resolve('c:/pnio/240826_guncellenmis-gruplamaile_9.xlsx')
  console.log('📂 Dosya Yükleniyor: ' + filePath)
  const wb = xlsx.readFile(filePath)

  // ==========================================================
  // 1. HAMMADDELER (Ingredients)
  // ==========================================================
  console.log('\n--- 1. Hammaddeler İçe Aktarılıyor ---')
  const ingSheet = wb.Sheets['Hammaddeler']
  const ingData = xlsx.utils.sheet_to_json(ingSheet) as any[]
  let ingCount = 0

  await runInChunks(ingData, 25, async (row) => {
    const name = row['Hammadde Adı (Normalize)']?.toString().trim()
    if (!name) return

    const family = row['Aile'] || 'Bilinmiyor'
    const layer_compatibility = row['Katman Uygunluğu'] || 'Bilinmiyor'
    const is_anchor = row['Çapa Nota mı? (3 katmanda da var)']?.toString().toUpperCase() === 'EVET'
    const popularity = parseInt(row['Toplam Kullanım (Popülerlik)']) || 0

    await prisma.ingredient.upsert({
      where: { name },
      update: { family, layer_compatibility, is_anchor, popularity },
      create: { name, family, layer_compatibility, is_anchor, popularity }
    })
    ingCount++
  })
  console.log('✅ ' + ingCount + ' hammadde başarıyla güncellendi.')

  // ==========================================================
  // 2. ÜRÜNLER (Products)
  // ==========================================================
  console.log('\n--- 2. Ürünler Kataloğu İçe Aktarılıyor ---')
  const prodSheet = wb.Sheets['Ürünler']
  const prodData = xlsx.utils.sheet_to_json(prodSheet) as any[]
  let prodCount = 0

  await runInChunks(prodData, 25, async (row) => {
    const sku = row['Parfüm Kodu (SKU)']?.toString().trim()
    if (!sku) return

    const barcode = row['barkod'] ? row['barkod'].toString().trim() : null
    const original_name = row['Orijinal Adı / İlham Alınan Profil']?.toString().trim() || 'PN Parfüm'
    const gender = normalizeGender(row['Cinsiyet Eğilimi'])

    const fragrance_family_str = row['Koku Ailesi (Normalize Dizi)'] || row['Koku Ailesi']
    const fragrance_family = parseStringToArray(fragrance_family_str)

    const top_notes = row['Üst Notalar'] || 'Gizli Formül'
    const heart_notes = row['Kalp Notalar'] || 'Gizli Formül'
    const base_notes = row['Dip Notalar'] || 'Gizli Formül'

    const mood_tag = row['Bıraktığı İzlenim / Duygu (Nöropazarlama)'] || 'Etkileyici'
    const persona_tag = row['Karakter / Persona'] || 'Modern'
    const status_tag = row['Sosyal Statü Algısı'] || 'Lüks'
    const bottle_aesthetic_tag = row['Şişe / Tasarım Estetiği'] || 'Minimalist'
    const season_tag = row['Mevsimsellik'] || 'Dört Mevsim'
    const time_of_day_tag = row['Kullanım Zamanı'] || 'Gündüz / Gece'
    const occasion_tag = row['Etkinlik / Mekan'] || 'Günlük'

    const longevity_score = parseInt(row['Kalıcılık Skoru (1-10)']) || 7
    const sillage_score = parseInt(row['Silaj / Yayılım Skoru (1-10)']) || 7
    const gift_safe_score = parseInt(row['Kör Alış / Hediyelik Skoru (1-10)']) || 7

    const age_focus = row['Yaş Grubu Odaklanması'] || 'Tüm Yaşlar'
    const content_tag = row['İçerik Şeffaflığı (Hassasiyet vb.)'] || 'Standart'

    await prisma.product.upsert({
      where: { sku },
      update: {
        barcode,
        original_name,
        gender,
        fragrance_family,
        top_notes,
        heart_notes,
        base_notes,
        mood_tag,
        persona_tag,
        status_tag,
        bottle_aesthetic_tag,
        season_tag,
        time_of_day_tag,
        occasion_tag,
        longevity_score,
        sillage_score,
        gift_safe_score,
        age_focus,
        content_tag
      },
      create: {
        sku,
        barcode,
        original_name,
        gender,
        fragrance_family,
        top_notes,
        heart_notes,
        base_notes,
        mood_tag,
        persona_tag,
        status_tag,
        bottle_aesthetic_tag,
        season_tag,
        time_of_day_tag,
        occasion_tag,
        longevity_score,
        sillage_score,
        gift_safe_score,
        age_focus,
        content_tag
      }
    })
    prodCount++
  })
  console.log('✅ ' + prodCount + ' ürün başarıyla güncellendi/eklendi.')

  // ==========================================================
  // 3. NOTA AĞIRLIKLARI (Nota_Agirlik_Detayi)
  // ==========================================================
  console.log('\n--- 3. Nota Ağırlıkları (Mix Engine) İçe Aktarılıyor ---')
  const weightsSheet = wb.Sheets['Nota_Agirlik_Detayi']
  const weightsData = xlsx.utils.sheet_to_json(weightsSheet) as any[]

  await prisma.productIngredient.deleteMany({})

  const allIngredients = await prisma.ingredient.findMany({ select: { id: true, name: true } })
  const ingMap = new Map<string, string>()
  allIngredients.forEach(i => ingMap.set(i.name, i.id))

  const toInsert = []
  for (const row of weightsData) {
    const productId = row['SKU']?.toString().trim()
    const ingredientName = row['Hammadde (Normalize)']?.toString().trim()
    if (!productId || !ingredientName) continue

    const ingredientId = ingMap.get(ingredientName)
    if (!ingredientId) continue

    const layer = row['Katman']?.toString().trim() || 'Bilinmiyor'
    const layer_weight_pct = parseFloat(row['Katman-İçi Ağırlık %']) || 0
    const absolute_weight_pct = parseFloat(row['Formüldeki Mutlak Ağırlık %']) || 0

    toInsert.push({
      productId,
      ingredientId,
      layer,
      layer_weight_pct,
      absolute_weight_pct
    })
  }

  if (toInsert.length > 0) {
    const res = await prisma.productIngredient.createMany({
      data: toInsert,
      skipDuplicates: true
    })
    console.log('✅ ' + res.count + ' nota ağırlıklandırma kaydı aktarıldı.')
  }

  // ==========================================================
  // 4. TRENDYOL LİSTELEMELERİ & SÜTUN M (Ürün Açıklaması)
  // ==========================================================
  console.log('\n--- 4. Trendyol Listelemeleri & Sütun M Açıklamaları Aktarılıyor ---')
  const trendyolSheet = wb.Sheets['trendyol']
  const rawTrendyol = xlsx.utils.sheet_to_json(trendyolSheet, { header: 1 }) as any[][]
  // Dosya_Esleme sayfası (K, L, M, N görselleri ve O tanıtım videosu)
  const dosyaEslemeSheet = wb.Sheets['Dosya_Esleme']
  const dosyaEslemeRows = xlsx.utils.sheet_to_json(dosyaEslemeSheet) as any[]
  const dosyaEslemeMap = new Map<string, string[]>()
  dosyaEslemeRows.forEach(d => {
    const b = String(d.Barkod || '').trim()
    const g1 = d['GÃ¶rsel 1 URL (ÃœrÃ¼n - parfumtasarla.com)'] || d['Görsel 1 URL (Ürün - parfumtasarla.com)'] // Sütun K
    const g2 = d['GÃ¶rsel 2 URL (Koku Ailesi Grubu)'] || d['Görsel 2 URL (Koku Ailesi Grubu)'] // Sütun L
    const g3 = d['GÃ¶rsel 3 URL (Profil Grubu)'] || d['Görsel 3 URL (Profil Grubu)'] // Sütun M
    const g4 = d['GÃ¶rsel 4 URL (PN Marka TanÄ±tÄ±mÄ± - Ortak)'] || d['Görsel 4 URL (PN Marka Tanıtımı - Ortak)'] // Sütun N
    const vid = d['TanÄ±tÄ±m Video URL (PN - Ortak, 8sn)'] || d['Tanıtım Video URL (PN - Ortak, 8sn)'] // Sütun O
    const mediaList = [g1, g2, g3, g4, vid].filter(u => u && typeof u === 'string' && u.startsWith('http'))
    if (b && mediaList.length > 0) dosyaEslemeMap.set(b, mediaList)
  })

  let listingCount = 0
  const trendyolRows = rawTrendyol.slice(1)
  await runInChunks(trendyolRows, 25, async (r) => {
    if (!r || r.length === 0) return

    const barcode = r[1] ? String(r[1]).trim() : null // Sütun B
    const rawSku = r[10] ? String(r[10]).trim() : null // Sütun K
    const productName = r[11] ? String(r[11]).trim() : null // Sütun L
    const description = r[12] ? String(r[12]).trim() : null // Sütun M
    const marketPrice = r[13] ? parseFloat(String(r[13])) : null // Sütun N
    const price = r[14] ? parseFloat(String(r[14])) : 599 // Sütun O
    const stock = r[16] ? parseInt(String(r[16])) : 98 // Sütun Q
    
    // Trendyol: U(20), V(21), W(22), X(23), Y(24), Z(25) Görselleri ve AA(26) Video
    let images = [r[20], r[21], r[22], r[23], r[24], r[25], r[26]].filter(url => url && typeof url === 'string' && url.startsWith('http'))
    
    // Dosya_Esleme haritasından (K, L, M, N, O) tamamla
    if (barcode && dosyaEslemeMap.has(barcode)) {
      const fallbackImgs = dosyaEslemeMap.get(barcode)!
      fallbackImgs.forEach(fImg => {
        if (!images.includes(fImg)) images.push(fImg)
      })
    } else {
      const defaultVideo = 'http://parfumtasarla.com/resimler/gruplar/PN-TANITIM.mp4'
      if (!images.includes(defaultVideo)) images.push(defaultVideo)
    }

    let product = null
    if (barcode) {
      product = await prisma.product.findFirst({ where: { barcode } })
    }
    if (!product && rawSku) {
      const cleanSku = rawSku.toUpperCase().replace('PPP', 'M ').replace('W', 'W ').replace(/\s+/g, ' ').trim()
      product = await prisma.product.findUnique({ where: { sku: cleanSku } })
      if (!product) {
        product = await prisma.product.findFirst({ where: { sku: { contains: rawSku, mode: 'insensitive' } } })
      }
    }

    if (product) {
      await prisma.marketplaceListing.upsert({
        where: {
          productId_platform: {
            productId: product.sku,
            platform: 'trendyol'
          }
        },
        update: {
          price,
          marketPrice,
          stock,
          images,
          description: description || undefined
        },
        create: {
          productId: product.sku,
          platform: 'trendyol',
          price,
          marketPrice,
          stock,
          images,
          description
        }
      })
      listingCount++
    }
  })

  console.log('✅ ' + listingCount + ' Trendyol listelemesi (Sütun M açıklamaları ve fiyatlar) başarıyla güncellendi.')
  console.log('\n🎉 Tüm veritabanı senkronizasyonu başarıyla tamamlandı!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())