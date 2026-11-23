// 25. yıl: eski müşteri listesindeki herkese kişiye özel, tek kullanımlık "1 alana 1 bedava" kuponu.
//
// Kullanım (DATABASE_URL ortam değişkeni olarak verilmelidir; .env OKUNMAZ):
//   npx tsx scripts/create_25yil_coupons.ts "C:\pnio\25.yil\eskimusteriler.xlsx"            -> kuru çalıştırma (DB'ye bağlanmaz, yazmaz)
//   npx tsx scripts/create_25yil_coupons.ts "<dosya>" --apply                               -> kuponları DB'ye yazar + kuponlu Excel üretir
//
// Kurallar: kupon türü 'bogo' (sepette en az 2 ürün, ucuz olan bedava), tek kullanımlık, 90 gün geçerli.
// Her telefon numarasına YALNIZ BİR kupon (aynı numara tekrar çalıştırılırsa mevcut kod yeniden kullanılır).
// Orijinal Excel değiştirilmez; yanına "<ad>_kuponlu.xlsx" yazılır (kodlar "kampanya kodu" sütununa, son geçerlilik tarihi yeni sütuna).
// Kişi anahtarı telefon numarasıdır (Türk cep telefonu 90xxxxxxxxxx'e normalleşir; yurt dışı/sabit hat rakam olarak). Telefonu olmayan satıra kupon verilmez.
import * as xlsx from 'xlsx'
import path from 'path'
import { generateCouponCode, phoneKey, headerKey } from '../src/lib/couponCodes'

const PREFIX = 'PN25-'
const VALID_DAYS = 90
const SOURCE_TAG = '25yil'

type Row = { index: number; cells: unknown[]; phone: string | null; name: string }

async function main() {
  const file = process.argv[2]
  const apply = process.argv.includes('--apply')
  if (!file) throw new Error('Excel dosya yolu gerekli')

  const wb = xlsx.readFile(file)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const aoa = xlsx.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '', raw: false })
  const header = (aoa[0] as unknown[]).map(headerKey)
  const col = (n: string) => header.indexOf(n)
  const iName = col('isim'), iSurname = col('soyisim'), iPhone = col('telefon'), iStatus = col('statü')
  if (iPhone < 0) throw new Error('"Telefon" sütunu bulunamadı')
  if (iStatus < 0) throw new Error('"Statü" sütunu bulunamadı')

  const rows: Row[] = []
  aoa.slice(1).forEach((cells, i) => {
    const c = cells as unknown[]
    if (!c.some((v) => String(v ?? '').trim())) return
    const name = [c[iName], c[iSurname]].map((v) => String(v ?? '').trim()).filter(Boolean).join(' ')
    rows.push({ index: i + 2, cells: c, phone: phoneKey(c[iPhone]), name })
  })

  // Sahip kararı: statüsü "Bayi" olanlara kupon verilmez (bayi fiyatlarında zaten indirim kuralı farklı).
  const isDealer = (r: Row) => headerKey(r.cells[iStatus]) === 'bayi'
  const dealers = rows.filter(isDealer)
  const invalid = rows.filter((r) => !r.phone && !isDealer(r))
  const seen = new Map<string, number>()
  const dupes: Row[] = []
  const eligible: Row[] = []
  for (const r of rows) {
    if (isDealer(r)) continue
    if (!r.phone) continue
    if (seen.has(r.phone)) { dupes.push(r); continue }
    seen.set(r.phone, r.index)
    eligible.push(r)
  }

  console.log(`Dosya: ${path.basename(file)} | satır: ${rows.length} | kupon verilecek: ${eligible.length} | bayi (atlandı): ${dealers.length} | geçersiz telefon: ${invalid.length} | tekrar eden telefon: ${dupes.length}`)
  invalid.slice(0, 20).forEach((r) => console.log(`  geçersiz telefon → satır ${r.index}: ${r.name || '(isimsiz)'}`))
  dupes.slice(0, 20).forEach((r) => console.log(`  tekrar → satır ${r.index} (ilk satır ${seen.get(r.phone!)})`))
  if (!apply) { console.log('Kuru çalıştırma: hiçbir şey yazılmadı. Yazmak için --apply ekleyin.'); return }

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ortam değişkeni gerekli')
  const { PrismaClient } = await import('@prisma/client')
  const { PrismaPg } = await import('@prisma/adapter-pg')
  const { Pool } = await import('pg')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  try {
    // Önceden bu liste için üretilmiş kuponlar (yeniden çalıştırmada aynı kod verilir).
    const existing = await prisma.coupon.findMany({ where: { source: { startsWith: `${SOURCE_TAG}|` } }, select: { code: true, source: true, expiresAt: true } })
    const byPhone = new Map(existing.map((c) => [String(c.source).split('|')[1], c]))
    const takenCodes = new Set((await prisma.coupon.findMany({ select: { code: true } })).map((c) => c.code))
    const expiresAt = new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000)

    const result = new Map<string, { code: string; expiresAt: Date | null }>()
    const toCreate: { code: string; discount_type: string; value: number; source: string; usage_limit: number; is_active: boolean; expiresAt: Date }[] = []
    for (const r of eligible) {
      const prev = byPhone.get(r.phone!)
      if (prev) { result.set(r.phone!, { code: prev.code, expiresAt: prev.expiresAt }); continue }
      let code = generateCouponCode(PREFIX)
      while (takenCodes.has(code)) code = generateCouponCode(PREFIX)
      takenCodes.add(code)
      toCreate.push({ code, discount_type: 'bogo', value: 100, source: `${SOURCE_TAG}|${r.phone}`, usage_limit: 1, is_active: true, expiresAt })
      result.set(r.phone!, { code, expiresAt })
    }
    if (toCreate.length) await prisma.coupon.createMany({ data: toCreate })
    console.log(`DB: ${toCreate.length} yeni kupon yazıldı, ${eligible.length - toCreate.length} mevcut kupon yeniden kullanıldı.`)

    // Kuponlu Excel (orijinal değişmez). Kod "kampanya kodu" sütununa yazılır (yoksa sona "kupon_kodu" eklenir);
    // sona ayrıca "kupon_son_gecerlilik" eklenir.
    const outAoa: unknown[][] = aoa.map((r) => [...(r as unknown[])])
    const base = (outAoa[0] as unknown[]).length
    let iCode = col('kampanya kodu')
    const newHeaders: string[] = []
    if (iCode < 0) { iCode = base; newHeaders.push('kupon_kodu') }
    newHeaders.push('kupon_son_gecerlilik')
    outAoa[0] = [...(outAoa[0] as unknown[]), ...newHeaders]
    const iExpiry = outAoa[0].length - 1
    aoa.forEach((r, i) => {
      if (i === 0) return
      const phone = phoneKey((r as unknown[])[iPhone])
      const hit = phone && seen.get(phone) === i + 1 ? result.get(phone) : undefined
      const row = outAoa[i]
      while (row.length <= iExpiry) row.push('')
      if (hit) {
        if (String(row[iCode] ?? '').trim()) console.log(`  uyarı: satır ${i + 1} "kampanya kodu" dolu, üzerine yazılmadı`)
        else row[iCode] = hit.code
        row[iExpiry] = hit.expiresAt ? hit.expiresAt.toLocaleDateString('tr-TR') : ''
      }
    })
    const out = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(out, xlsx.utils.aoa_to_sheet(outAoa), wb.SheetNames[0])
    const outPath = path.join(path.dirname(file), path.basename(file, path.extname(file)) + '_kuponlu.xlsx')
    xlsx.writeFile(out, outPath)
    console.log('Yazıldı:', outPath)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch((e) => { console.error('HATA:', e.message); process.exit(1) })
