import * as XLSX from 'xlsx'

// Ürün Excel paneli için saf (DB'siz) mantık: dosya üret, ayrıştır, doğrula, fark çıkar.
// `original_name` bilinçli olarak hiçbir yerde yok (marka güvenliği).

export type ProductRow = {
  row?: number // Excel satır numarası (başlık = 1)
  sku: string
  barkod?: string
  seo_name?: string
  publish_status?: string
  gender?: string
  is_featured?: boolean
  is_on_sale?: boolean
  top_notes?: string
  heart_notes?: string
  base_notes?: string
  base_cost?: number
  dealer_price?: number
  fiyat?: number
  piyasa_fiyati?: number
  stok?: number
  gorsel_1?: string
  gorsel_2?: string
  gorsel_3?: string
}
export type ExportProduct = ProductRow & { koleksiyon: string }
export type ExistingProduct = Omit<ProductRow, 'row'>
export type FormulaRow = { sku: string; hammadde: string; katman: 'Üst' | 'Kalp' | 'Dip'; katman_yuzde: number; mutlak_yuzde: number }
export type RowIssue = { sheet: 'Ürünler' | 'Formül'; row: number; sku?: string; message: string }

export const PRODUCT_SHEET = 'Ürünler'
export const FORMULA_SHEET = 'Formül'
export const VALID_STATUSES = ['ACTIVE', 'DRAFT', 'PASSIVE'] as const

const PRODUCT_HEADER = ['sku', 'koleksiyon', 'barkod', 'seo_name', 'publish_status', 'gender', 'is_featured', 'is_on_sale', 'top_notes', 'heart_notes', 'base_notes', 'base_cost', 'dealer_price', 'fiyat', 'piyasa_fiyati', 'stok', 'gorsel_1', 'gorsel_2', 'gorsel_3'] as const
const FORMULA_HEADER = ['sku', 'hammadde', 'katman', 'katman_yuzde', 'mutlak_yuzde'] as const

const TEXT_FIELDS = ['barkod', 'seo_name', 'publish_status', 'gender', 'top_notes', 'heart_notes', 'base_notes', 'gorsel_1', 'gorsel_2', 'gorsel_3'] as const
const NUM_FIELDS = ['base_cost', 'dealer_price', 'fiyat', 'piyasa_fiyati', 'stok'] as const
const BOOL_FIELDS = ['is_featured', 'is_on_sale'] as const
const COMPARE_FIELDS = [...TEXT_FIELDS, ...NUM_FIELDS, ...BOOL_FIELDS] as const

const BARCODE_RE = /^\d{8,14}$/
const LAYERS: Record<string, FormulaRow['katman']> = { 'üst': 'Üst', 'kalp': 'Kalp', 'dip': 'Dip' }

// ---------- Üretme ----------

export function buildWorkbook(products: ExportProduct[], formulas: FormulaRow[]): Buffer {
  const wb = XLSX.utils.book_new()

  const pAoa: unknown[][] = [[...PRODUCT_HEADER]]
  for (const p of products) {
    pAoa.push(PRODUCT_HEADER.map((h) => {
      const v = (p as Record<string, unknown>)[h]
      if (v === undefined || v === null) return ''
      if (typeof v === 'boolean') return v ? 'EVET' : 'HAYIR'
      return v
    }))
  }
  const ps = XLSX.utils.aoa_to_sheet(pAoa)
  // Barkod sütununu metin yap: Excel 13 haneli barkodu 8.68E+12'ye çevirmesin.
  const barkodCol = PRODUCT_HEADER.indexOf('barkod')
  for (let r = 1; r < pAoa.length; r++) {
    const cell = ps[XLSX.utils.encode_cell({ r, c: barkodCol })]
    if (cell && cell.v !== '') { cell.t = 's'; cell.v = String(cell.v); cell.z = '@' }
  }
  XLSX.utils.book_append_sheet(wb, ps, PRODUCT_SHEET)

  const fAoa: unknown[][] = [[...FORMULA_HEADER], ...formulas.map((f) => FORMULA_HEADER.map((h) => f[h]))]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fAoa), FORMULA_SHEET)

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

// ---------- Ayrıştırma ----------

function cleanText(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined
  const s = String(v).trim()
  return s === '' ? undefined : s
}

// "1250.5", "1250,5" ve "1.250,50" kabul; "abc" → NaN. "1.250" (nokta + tam 3 hane) bin ayracıdır.
export function parseNumber(raw: string): number {
  const s = raw.trim().replace(/\s/g, '')
  if (/^-?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(s)) return Number(s.replace(/\./g, '').replace(',', '.'))
  if (/^-?\d+([.,]\d+)?$/.test(s)) return Number(s.replace(',', '.'))
  return NaN
}

function parseBool(raw: string): boolean | undefined {
  const s = raw.trim().toLocaleLowerCase('tr')
  if (['evet', 'e', 'true', '1', 'yes'].includes(s)) return true
  if (['hayır', 'hayir', 'h', 'false', '0', 'no'].includes(s)) return false
  return undefined
}

function readSheet(wb: XLSX.WorkBook, name: string): { header: string[]; rows: { n: number; cells: unknown[] }[] } | null {
  const ws = wb.Sheets[name]
  if (!ws) return null
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: false, defval: '', blankrows: false })
  if (aoa.length === 0) return { header: [], rows: [] }
  const header = (aoa[0] as unknown[]).map((h) => String(h ?? '').trim().toLowerCase())
  const rows = aoa.slice(1).map((cells, i) => ({ n: i + 2, cells: cells as unknown[] }))
    .filter((r) => r.cells.some((c) => String(c ?? '').trim() !== ''))
  return { header, rows }
}

export function parseWorkbook(buf: Buffer): { products: ProductRow[]; formulas: FormulaRow[]; hasFormulaSheet: boolean; issues: RowIssue[] } {
  const wb = XLSX.read(buf, { type: 'buffer' })
  const issues: RowIssue[] = []
  const products: ProductRow[] = []
  const formulas: FormulaRow[] = []

  const ps = readSheet(wb, PRODUCT_SHEET)
  if (!ps) issues.push({ sheet: 'Ürünler', row: 0, message: `"${PRODUCT_SHEET}" sayfası bulunamadı` })
  else {
    const col = (name: string) => ps.header.indexOf(name)
    if (col('sku') < 0) issues.push({ sheet: 'Ürünler', row: 1, message: '"sku" sütunu bulunamadı' })
    else {
      for (const { n, cells } of ps.rows) {
        const get = (name: string) => (col(name) >= 0 ? cleanText(cells[col(name)]) : undefined)
        const sku = get('sku')
        if (!sku) { issues.push({ sheet: 'Ürünler', row: n, message: 'sku boş' }); continue }
        const out: Record<string, unknown> = { row: n, sku }
        let bad = false
        const fail = (message: string) => { issues.push({ sheet: 'Ürünler', row: n, sku, message }); bad = true }
        for (const f of TEXT_FIELDS) {
          const v = get(f)
          if (v === undefined) continue
          if (f === 'barkod' && !BARCODE_RE.test(v)) { fail(`barkod geçersiz ("${v}"): 8-14 haneli düz rakam olmalı (Excel'de hücreyi metin yapın)`); continue }
          out[f] = f === 'publish_status' ? v.toUpperCase() : v
        }
        for (const f of NUM_FIELDS) {
          const v = get(f)
          if (v === undefined) continue
          const num = parseNumber(v)
          if (!Number.isFinite(num) || num < 0) { fail(`${f} sayı olmalı ("${v}")`); continue }
          if (f === 'stok' && !Number.isInteger(num)) { fail(`stok tam sayı olmalı ("${v}")`); continue }
          out[f] = num
        }
        for (const f of BOOL_FIELDS) {
          const v = get(f)
          if (v === undefined) continue
          const b = parseBool(v)
          if (b === undefined) { fail(`${f} EVET/HAYIR olmalı ("${v}")`); continue }
          out[f] = b
        }
        if (!bad) products.push(out as ProductRow)
      }
    }
  }

  const fs = readSheet(wb, FORMULA_SHEET)
  if (fs) {
    const col = (name: string) => fs.header.indexOf(name)
    for (const { n, cells } of fs.rows) {
      const get = (name: string) => (col(name) >= 0 ? cleanText(cells[col(name)]) : undefined)
      const sku = get('sku')
      const fail = (message: string) => issues.push({ sheet: 'Formül', row: n, sku, message })
      const hammadde = get('hammadde')
      const katmanRaw = get('katman')
      const katman = katmanRaw ? LAYERS[katmanRaw.toLocaleLowerCase('tr')] : undefined
      const k = get('katman_yuzde')
      const m = get('mutlak_yuzde')
      if (!sku || !hammadde) { fail('sku ve hammadde zorunlu'); continue }
      if (!katman) { fail(`katman Üst/Kalp/Dip olmalı ("${katmanRaw ?? ''}")`); continue }
      const kn = k === undefined ? NaN : parseNumber(k)
      const mn = m === undefined ? NaN : parseNumber(m)
      if (!Number.isFinite(kn) || !Number.isFinite(mn) || kn < 0 || mn < 0) { fail('katman_yuzde ve mutlak_yuzde sayı olmalı'); continue }
      formulas.push({ sku, hammadde, katman, katman_yuzde: kn, mutlak_yuzde: mn })
    }
  }

  return { products, formulas, hasFormulaSheet: fs !== null, issues }
}

// ---------- Fark çıkarma ----------

const same = (a: unknown, b: unknown) => (a ?? undefined) === (b ?? undefined)

export function planChanges(input: {
  rows: ProductRow[]
  existing: Map<string, ExistingProduct>
  barcodeOwners: Map<string, string> // barkod → o barkodu taşıyan mevcut sku
}): { updates: { sku: string; changes: Record<string, [unknown, unknown]> }[]; issues: RowIssue[] } {
  const { rows, existing, barcodeOwners } = input
  const issues: RowIssue[] = []
  const updates: { sku: string; changes: Record<string, [unknown, unknown]> }[] = []

  const barcodeCount = new Map<string, number>()
  for (const r of rows) if (r.barkod) barcodeCount.set(r.barkod, (barcodeCount.get(r.barkod) ?? 0) + 1)

  for (const r of rows) {
    const issue = (message: string) => issues.push({ sheet: 'Ürünler', row: r.row ?? 0, sku: r.sku, message })
    const cur = existing.get(r.sku)
    if (!cur) { issue('Bilinmeyen sku (yeni ürün bu yoldan oluşturulmaz)'); continue }
    if (r.publish_status !== undefined && !(VALID_STATUSES as readonly string[]).includes(r.publish_status)) {
      issue(`publish_status ${VALID_STATUSES.join('/')} olmalı ("${r.publish_status}")`); continue
    }
    if (r.barkod !== undefined) {
      if ((barcodeCount.get(r.barkod) ?? 0) > 1) { issue(`Barkod ${r.barkod} dosyada birden fazla satırda`); continue }
      const owner = barcodeOwners.get(r.barkod)
      if (owner && owner !== r.sku) { issue(`Barkod ${r.barkod} başka üründe kayıtlı (${owner})`); continue }
    }
    const changes: Record<string, [unknown, unknown]> = {}
    for (const f of COMPARE_FIELDS) {
      const next = (r as Record<string, unknown>)[f]
      if (next === undefined) continue
      const old = (cur as Record<string, unknown>)[f]
      if (!same(old, next)) changes[f] = [old ?? null, next]
    }
    if (Object.keys(changes).length > 0) updates.push({ sku: r.sku, changes })
  }
  return { updates, issues }
}
