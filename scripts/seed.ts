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
    .split(/[\/|]/) // Split by slash or pipe
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function normalizeGender(gender: string | undefined): string {
  if (!gender) return 'Unisex'
  const g = gender.trim()
  if (g.includes('KadÄ±n') || g.toLowerCase() === 'kadın') return 'Kadın'
  if (g.toLowerCase() === 'erkek') return 'Erkek'
  return 'Unisex'
}

async function main() {
  const filePath = path.resolve('c:/pnio/PN_Parfum_Veri_Seti_v2_Nota_Agirlikli-14081600.xlsx')
  console.log(`Reading file: ${filePath}`)
  
  const workbook = xlsx.readFile(filePath)
  
  // 1. INGREDIENTS (Hammaddeler)
  console.log('\n--- Seeding Ingredients ---')
  const ingredientsSheet = workbook.Sheets['Hammaddeler']
  const ingredientsData = xlsx.utils.sheet_to_json(ingredientsSheet)
  let ingSuccess = 0
  
  for (const row of ingredientsData as any[]) {
    const name = row['Hammadde Adı (Normalize)']?.toString().trim()
    if (!name) continue
    
    const family = row['Aile'] || 'Bilinmiyor'
    const layer_compatibility = row['Katman Uygunluğu'] || 'Bilinmiyor'
    const is_anchor = row['Çapa Nota mı? (3 katmanda da var)']?.toString().toUpperCase() === 'EVET'
    const popularity = parseInt(row['Toplam Kullanım (Popülerlik)']) || 0
    
    await prisma.ingredient.upsert({
      where: { name },
      update: { family, layer_compatibility, is_anchor, popularity },
      create: { name, family, layer_compatibility, is_anchor, popularity }
    })
    ingSuccess++
  }
  console.log(`Ingredients seeded: ${ingSuccess}`)

  // 2. PRODUCTS (Ürünler)
  console.log('\n--- Seeding Products ---')
  const productsSheet = workbook.Sheets['Ürünler']
  const productsData = xlsx.utils.sheet_to_json(productsSheet)
  let prodSuccess = 0
  
  for (const row of productsData as any[]) {
    const sku = row['Parfüm Kodu (SKU)'] || row['SKU']
    if (!sku) continue
    
    const original_name = row['Orijinal Adı / İlham Alınan Profil'] || row['Orijinal Adı'] || 'Unknown'
    const gender = normalizeGender(row['Cinsiyet Eğilimi'])
    
    const fragrance_family_str = row['Koku Ailesi (Normalize Dizi)'] || row['Koku Ailesi']
    const fragrance_family = parseStringToArray(fragrance_family_str)
    
    const top_notes = row['Üst Notalar'] || 'Gizli Formül'
    const heart_notes = row['Kalp Notalar'] || 'Gizli Formül'
    const base_notes = row['Dip Notalar'] || 'Gizli Formül'
    
    const mood_tag = row['Bıraktığı İzlenim / Duygu (Nöropazarlama)'] || row['Bıraktığı İzlenim / Duygu'] || 'Bilinmiyor'
    const persona_tag = row['Karakter / Persona'] || 'Bilinmiyor'
    const status_tag = row['Sosyal Statü Algısı'] || 'Bilinmiyor'
    const bottle_aesthetic_tag = row['Şişe / Tasarım Estetiği'] || 'Bilinmiyor'
    const season_tag = row['Mevsimsellik'] || 'Bilinmiyor'
    const time_of_day_tag = row['Kullanım Zamanı'] || 'Bilinmiyor'
    const occasion_tag = row['Etkinlik / Mekan'] || 'Bilinmiyor'

    const longevity_score = parseInt(row['Kalıcılık Skoru (1-10)']) || 5
    const sillage_score = parseInt(row['Silaj / Yayılım Skoru (1-10)']) || 5
    const gift_safe_score = parseInt(row['Kör Alış / Hediyelik Skoru (1-10)']) || 5
    
    const age_focus = row['Yaş Grubu Odaklanması'] || 'Bilinmiyor'
    const content_tag = row['İçerik Şeffaflığı (Hassasiyet vb.)'] || row['İçerik Şeffaflığı'] || 'Bilinmiyor'

    await prisma.product.upsert({
      where: { sku },
      update: {
        original_name, gender, fragrance_family, top_notes, heart_notes, base_notes, mood_tag, persona_tag, status_tag, 
        bottle_aesthetic_tag, season_tag, time_of_day_tag, occasion_tag, longevity_score, 
        sillage_score, gift_safe_score, age_focus, content_tag
      },
      create: {
        sku, original_name, gender, fragrance_family, top_notes, heart_notes, base_notes, mood_tag, persona_tag, status_tag, 
        bottle_aesthetic_tag, season_tag, time_of_day_tag, occasion_tag, longevity_score, 
        sillage_score, gift_safe_score, age_focus, content_tag
      }
    })
    prodSuccess++
  }
  console.log(`Products seeded: ${prodSuccess}`)

  // 3. PRODUCT INGREDIENTS (Nota_Agirlik_Detayi)
  console.log('\n--- Seeding Product Ingredients (Weights) ---')
  const weightsSheet = workbook.Sheets['Nota_Agirlik_Detayi']
  const weightsData = xlsx.utils.sheet_to_json(weightsSheet)
  let weightSuccess = 0
  
  // Önce eski ilişkileri temizleyelim ki tekrarlı veri olmasın
  await prisma.productIngredient.deleteMany({})

  // Veritabanındaki tüm Ingredient'ların ID'lerini hafızada tutalım (hızlı eşleştirme için)
  const allIngredients = await prisma.ingredient.findMany({ select: { id: true, name: true } })
  const ingredientMap = new Map<string, string>()
  allIngredients.forEach(ing => ingredientMap.set(ing.name, ing.id))
  
  // Toplu ekleme yapalım (daha hızlı)
  const productIngredientsToInsert = []
  
  for (const row of weightsData as any[]) {
    const productId = row['SKU']?.toString().trim()
    const ingredientName = row['Hammadde (Normalize)']?.toString().trim()
    if (!productId || !ingredientName) continue
    
    const ingredientId = ingredientMap.get(ingredientName)
    if (!ingredientId) {
      console.warn(`Hammadde bulunamadı: ${ingredientName}`)
      continue
    }

    const layer = row['Katman']?.toString().trim() || 'Bilinmiyor'
    const layer_weight_pct = parseFloat(row['Katman-İçi Ağırlık %']) || 0
    const absolute_weight_pct = parseFloat(row['Formüldeki Mutlak Ağırlık %']) || 0

    productIngredientsToInsert.push({
      productId,
      ingredientId,
      layer,
      layer_weight_pct,
      absolute_weight_pct
    })
  }
  
  if (productIngredientsToInsert.length > 0) {
    const result = await prisma.productIngredient.createMany({
      data: productIngredientsToInsert,
      skipDuplicates: true
    })
    weightSuccess = result.count
  }
  console.log(`Product Ingredients seeded: ${weightSuccess}`)

  console.log(`\nImport complete!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
