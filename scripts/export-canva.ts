import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Fetching female products from database...')
  
  // 'Kadın' veya 'Bayan' etiketli veya unisex ürünleri alabiliriz. Biz sadece Kadın olanları alalım.
  const products = await prisma.product.findMany({
    where: {
      gender: {
        in: ['Kadın', 'Bayan', 'Female']
      }
    },
    orderBy: {
      sku: 'asc'
    }
  })

  console.log(`Found ${products.length} female products.`)

  if (products.length === 0) {
    console.log('No female products found in the database.')
    return
  }

  // Create CSV header
  const headers = ['SKU', 'Parfum_Ismi', 'Koku_Ailesi', 'Ust_Nota', 'Kalp_Nota', 'Dip_Nota', 'Karakter']
  
  // Map data to CSV rows
  const rows = products.map(p => {
    // Koku ailesi dizisini virgülle ayırarak birleştir
    const families = p.fragrance_family.join(' & ')
    
    // Notaları temizle (virgülleri vs CSV bozmasın diye tırnak içine al)
    const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`
    
    return [
      escapeCsv(p.sku),
      escapeCsv(p.original_name),
      escapeCsv(families),
      escapeCsv(p.top_notes),
      escapeCsv(p.heart_notes),
      escapeCsv(p.base_notes),
      escapeCsv(`${p.mood_tag} - ${p.bottle_aesthetic_tag}`)
    ].join(',')
  })

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n')

  // Save to file
  const outputPath = path.join(process.cwd(), 'canva_bayan_parfumleri.csv')
  fs.writeFileSync(outputPath, csvContent, 'utf-8')

  console.log(`\nSuccessfully exported to: ${outputPath}`)
  console.log('You can now upload this CSV file to Canva Bulk Create!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
