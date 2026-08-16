import { PrismaClient } from '@prisma/client'
import { Meilisearch } from 'meilisearch'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()
const meiliClient = new Meilisearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_ADMIN_KEY || '',
})

async function syncMeilisearch() {
  console.log('Fetching products from database...')
  const products = await prisma.product.findMany({
    select: {
      sku: true,
      original_name: true,
      gender: true,
      fragrance_family: true,
      persona_tag: true,
      longevity_score: true,
      sillage_score: true
    }
  })

  console.log(`Syncing ${products.length} products to Meilisearch index 'products'...`)

  const index = meiliClient.index('products')
  
  // Set searchable and filterable attributes (based on Brief)
  await index.updateSettings({
    searchableAttributes: [
      'original_name',
      'fragrance_family',
      'persona_tag'
    ],
    filterableAttributes: [
      'gender',
      'fragrance_family',
      'longevity_score',
      'sillage_score'
    ],
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 6
      }
    }
  })

  // Add documents
  const response = await index.addDocuments(products, { primaryKey: 'sku' })
  console.log('Meilisearch task added:', response)
  console.log('Sync process initiated.')
}

syncMeilisearch()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
