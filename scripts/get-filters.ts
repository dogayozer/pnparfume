import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const seasons = await prisma.product.findMany({ select: { season_tag: true }, distinct: ['season_tag'] })
  const occasions = await prisma.product.findMany({ select: { occasion_tag: true }, distinct: ['occasion_tag'] })
  const genders = await prisma.product.findMany({ select: { gender: true }, distinct: ['gender'] })
  const personas = await prisma.product.findMany({ select: { persona_tag: true }, distinct: ['persona_tag'] })

  console.log("Seasons:", seasons.map(s => s.season_tag))
  console.log("Occasions:", occasions.map(s => s.occasion_tag))
  console.log("Genders:", genders.map(s => s.gender))
  console.log("Personas:", personas.map(s => s.persona_tag))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
