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

async function main() {
  const filePath = path.resolve('c:/pnio/PN_Parfum_Veri_Seti_v2_Nota_Agirlikli-14081600.xlsx')
  console.log(`Reading file: ${filePath}`)
  
  const workbook = xlsx.readFile(filePath)
  const productsSheet = workbook.Sheets['Ürünler']
  const productsData = xlsx.utils.sheet_to_json(productsSheet)
  let prodSuccess = 0
  
  for (const row of productsData as any[]) {
    const sku = row['Parfüm Kodu (SKU)'] || row['SKU']
    if (!sku) continue
    
    const top_notes = row['Üst Notalar'] || 'Gizli Formül'
    const heart_notes = row['Kalp Notalar'] || 'Gizli Formül'
    const base_notes = row['Dip Notalar'] || 'Gizli Formül'
    
    await prisma.product.updateMany({
      where: { sku },
      data: { top_notes, heart_notes, base_notes }
    })
    prodSuccess++
    if (prodSuccess % 50 === 0) console.log(`Updated ${prodSuccess} products...`)
  }
  
  console.log(`Successfully updated ${prodSuccess} products with real notes!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
