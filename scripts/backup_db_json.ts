// Canlı veritabanının SALT-OKUNUR JSON yedeği: her tablo ayrı dosya + _manifest.json.
// Kullanım (DATABASE_URL ortam değişkeni olarak verilir; .env OKUNMAZ):
//   npx tsx scripts/backup_db_json.ts "C:\pnio\backups"
// Çıktı: <hedef>\pnparfume_<tarih>\<model>.json. DİKKAT: müşteri/sipariş/yönetici (parola özeti) verisi içerir.
import fs from 'fs'
import path from 'path'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ortam değişkeni gerekli')
  const root = process.argv[2]
  if (!root) throw new Error('Hedef klasör gerekli')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) }) as any
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const dir = path.join(root, `pnparfume_${stamp}`)
  fs.mkdirSync(dir, { recursive: true })

  const replacer = (_k: string, v: unknown) => (typeof v === 'bigint' ? v.toString() : v)
  const tables: Record<string, number | string> = {}
  try {
    for (const m of Prisma.dmmf.datamodel.models) {
      const delegate = prisma[m.name.charAt(0).toLowerCase() + m.name.slice(1)]
      try {
        const rows = await delegate.findMany()
        fs.writeFileSync(path.join(dir, `${m.name.charAt(0).toLowerCase() + m.name.slice(1)}.json`), JSON.stringify(rows, replacer, 1))
        tables[m.name] = rows.length
        console.log(`${m.name}: ${rows.length}`)
      } catch (e: any) {
        tables[m.name] = `HATA: ${String(e?.message || e).split('\n')[0].slice(0, 120)}`
        console.log(`${m.name}: ${tables[m.name]}`)
      }
    }
  } finally {
    fs.writeFileSync(path.join(dir, '_manifest.json'), JSON.stringify({ timestamp: new Date().toISOString(), tables }, null, 2))
    await prisma.$disconnect()
  }
  console.log(`\nYedek klasörü: ${dir}`)
}
main()
