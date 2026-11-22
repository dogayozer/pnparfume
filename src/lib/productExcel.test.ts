import test from 'node:test'
import assert from 'node:assert/strict'
import * as XLSX from 'xlsx'
import { buildWorkbook, parseWorkbook, planChanges, type ExportProduct, type FormulaRow, type ProductRow } from './productExcel'

const prod = (over: Partial<ExportProduct> = {}): ExportProduct => ({
  sku: 'PN M 1', koleksiyon: 'PN', barkod: '8680000000012', seo_name: 'Ad', publish_status: 'ACTIVE', gender: 'Erkek',
  is_featured: false, is_on_sale: false, top_notes: 'a', heart_notes: 'b', base_notes: 'c',
  base_cost: 10, dealer_price: 20, fiyat: 699, piyasa_fiyati: 799, stok: 5,
  gorsel_1: 'x.jpg', gorsel_2: undefined, gorsel_3: undefined, ...over,
})
const formulas: FormulaRow[] = [
  { sku: 'PN M 1', hammadde: 'Bergamot', katman: 'Üst', katman_yuzde: 60, mutlak_yuzde: 6 },
  { sku: 'PN M 1', hammadde: 'Misk', katman: 'Dip', katman_yuzde: 100, mutlak_yuzde: 10 },
]
const existing = (sku: string, over: Record<string, unknown> = {}) => ({
  sku, barkod: '8680000000012', seo_name: 'Ad', publish_status: 'ACTIVE', gender: 'Erkek', is_featured: false, is_on_sale: false,
  top_notes: 'a', heart_notes: 'b', base_notes: 'c', base_cost: 10, dealer_price: 20,
  fiyat: 699, piyasa_fiyati: 799, stok: 5, gorsel_1: 'x.jpg', gorsel_2: undefined, gorsel_3: undefined, ...over,
})

function sheetOf(rows: unknown[][], name = 'Ürünler') {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name)
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

test('buildWorkbook ürünler sayfasında original_name sütunu yok', () => {
  const wb = XLSX.read(buildWorkbook([prod()], formulas), { type: 'buffer' })
  const header = XLSX.utils.sheet_to_json<string[]>(wb.Sheets['Ürünler'], { header: 1 })[0]
  assert.ok(!header.includes('original_name'))
  assert.deepEqual(header.slice(0, 3), ['sku', 'koleksiyon', 'barkod'])
})

test('round-trip: build sonra parse aynı satırları verir', () => {
  const parsed = parseWorkbook(buildWorkbook([prod(), prod({ sku: 'PN M 2', barkod: '8680000000029' })], formulas))
  assert.equal(parsed.issues.length, 0)
  assert.equal(parsed.products.length, 2)
  assert.equal(parsed.products[0].barkod, '8680000000012')
  assert.equal(parsed.products[0].fiyat, 699)
  assert.equal(parsed.hasFormulaSheet, true)
  assert.deepEqual(parsed.formulas, formulas)
})

test('parse: boş hücre undefined', () => {
  const buf = sheetOf([['sku', 'barkod', 'fiyat'], ['PN M 1', '', '']])
  const row = parseWorkbook(buf).products[0]
  assert.equal(row.barkod, undefined)
  assert.equal(row.fiyat, undefined)
})

test('parse: virgüllü Türkçe sayı kabul, metin satır hatası', () => {
  const buf = sheetOf([['sku', 'fiyat'], ['PN M 1', '1.250,50'], ['PN M 2', 'abc']])
  const p = parseWorkbook(buf)
  assert.equal(p.products[0].fiyat, 1250.5)
  assert.equal(p.issues.length, 1)
  assert.equal(p.issues[0].row, 3)
  assert.equal(p.issues[0].sku, 'PN M 2')
})

test('parse: barkod 8.68E+12 reddedilir, düz rakam kabul', () => {
  const buf = sheetOf([['sku', 'barkod'], ['PN M 1', '8.68E+12'], ['PN M 2', '8680000000012']])
  const p = parseWorkbook(buf)
  assert.equal(p.issues.length, 1)
  assert.equal(p.issues[0].sku, 'PN M 1')
  assert.equal(p.products.find((r) => r.sku === 'PN M 2')?.barkod, '8680000000012')
})

test('planChanges: bilinmeyen sku → issue, update yok', () => {
  const r = planChanges({ rows: [{ sku: 'YOK', fiyat: 1 }], existing: new Map(), barcodeOwners: new Map() })
  assert.equal(r.updates.length, 0)
  assert.equal(r.issues.length, 1)
})

test('planChanges: barkod başka üründe → o satır issue, diğer satır update', () => {
  const rows: ProductRow[] = [{ sku: 'A', barkod: '8680000000111' }, { sku: 'B', fiyat: 5 }]
  const r = planChanges({
    rows,
    existing: new Map([['A', existing('A', { barkod: '1111111111111' })], ['B', existing('B')]]),
    barcodeOwners: new Map([['8680000000111', 'C']]),
  })
  assert.deepEqual(r.updates.map((u) => u.sku), ['B'])
  assert.equal(r.issues.length, 1)
  assert.equal(r.issues[0].sku, 'A')
})

test('planChanges: dosyada tekrar eden barkod → iki satır da issue', () => {
  const rows: ProductRow[] = [{ sku: 'A', barkod: '8680000000111' }, { sku: 'B', barkod: '8680000000111' }]
  const r = planChanges({ rows, existing: new Map([['A', existing('A', { barkod: undefined })], ['B', existing('B', { barkod: undefined })]]), barcodeOwners: new Map() })
  assert.equal(r.updates.length, 0)
  assert.deepEqual(r.issues.map((i) => i.sku).sort(), ['A', 'B'])
})

test('planChanges: yalnız değişen alanlar changes içinde, değişmeyen satır updates dışı', () => {
  const r = planChanges({
    rows: [{ sku: 'A', fiyat: 800, stok: 5 }, { sku: 'B', fiyat: 699 }],
    existing: new Map([['A', existing('A')], ['B', existing('B')]]),
    barcodeOwners: new Map(),
  })
  assert.deepEqual(r.updates.map((u) => u.sku), ['A'])
  assert.deepEqual(r.updates[0].changes, { fiyat: [699, 800] })
})

test('planChanges: boş (undefined) alan mevcut değeri silmez', () => {
  const r = planChanges({ rows: [{ sku: 'A', barkod: undefined, top_notes: undefined }], existing: new Map([['A', existing('A')]]), barcodeOwners: new Map() })
  assert.equal(r.updates.length, 0)
})

test('planChanges: publish_status ACTIVE|DRAFT|PASSIVE dışı → issue', () => {
  const ok = planChanges({ rows: [{ sku: 'A', publish_status: 'PASSIVE' }], existing: new Map([['A', existing('A')]]), barcodeOwners: new Map() })
  assert.equal(ok.issues.length, 0)
  const bad = planChanges({ rows: [{ sku: 'A', publish_status: 'SILINDI' }], existing: new Map([['A', existing('A')]]), barcodeOwners: new Map() })
  assert.equal(bad.updates.length, 0)
  assert.equal(bad.issues.length, 1)
})

// ---- İnceleme düzeltmeleri ----
import { blockedFormulaSkus, enforceShowcaseLimit, mergeImages, formulaKey } from './productExcel'

function cellSheet(cells: Record<string, { v: unknown; t: 'n' | 's'; z?: string }>, name = 'Ürünler') {
  const ws: XLSX.WorkSheet = {}
  let maxC = 0, maxR = 0
  for (const [addr, c] of Object.entries(cells)) {
    ws[addr] = c as XLSX.CellObject
    const d = XLSX.utils.decode_cell(addr); maxC = Math.max(maxC, d.c); maxR = Math.max(maxR, d.r)
  }
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxR, c: maxC } })
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, name)
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

test('parse: #,##0 biçimli 1250 hücresi 1250 okunur (1,25 değil)', () => {
  const buf = cellSheet({ A1: { v: 'sku', t: 's' }, B1: { v: 'fiyat', t: 's' }, A2: { v: 'PN M 1', t: 's' }, B2: { v: 1250, t: 'n', z: '#,##0' } })
  assert.equal(parseWorkbook(buf).products[0].fiyat, 1250)
})

test('parse: sayı tipli barkod hücresi reddedilir', () => {
  const buf = cellSheet({ A1: { v: 'sku', t: 's' }, B1: { v: 'barkod', t: 's' }, A2: { v: 'PN M 1', t: 's' }, B2: { v: 12345678901, t: 'n' } })
  const p = parseWorkbook(buf)
  assert.equal(p.products.length, 0)
  assert.match(p.issues[0].message, /metin/)
})

test('parse: fiyat 0 reddedilir, base_cost 0 kabul', () => {
  const p = parseWorkbook(sheetOf([['sku', 'fiyat', 'base_cost'], ['A', '0', '0'], ['B', '5', '0']]))
  assert.equal(p.issues.length, 1)
  assert.equal(p.issues[0].sku, 'A')
  assert.equal(p.products.find((r) => r.sku === 'B')?.base_cost, 0)
})

test('parse: cinsiyet Erkek/Kadın/Unisex/UNISEX dışı reddedilir', () => {
  const p = parseWorkbook(sheetOf([['sku', 'gender'], ['A', 'Male'], ['B', 'Kadın'], ['C', 'UNISEX']]))
  assert.deepEqual(p.issues.map((i) => i.sku), ['A'])
  assert.equal(p.products.length, 2)
})

test('parse: çıplak görsel adı kasap-image yoluna çevrilir', () => {
  const p = parseWorkbook(sheetOf([['sku', 'gorsel_1', 'gorsel_2'], ['A', '201.jpg', 'http://x.com/a.jpg']]))
  assert.equal(p.products[0].gorsel_1, '/api/kasap-image/201.jpg')
  assert.equal(p.products[0].gorsel_2, 'http://x.com/a.jpg')
})

test('planChanges: 1e-6 altı sayı farkı değişiklik sayılmaz', () => {
  const r = planChanges({ rows: [{ sku: 'A', base_cost: 0.3333333333 }], existing: new Map([['A', existing('A', { base_cost: 1 / 3 })]]), barcodeOwners: new Map() })
  assert.equal(r.updates.length, 0)
})

test('formulaKey: 1/3 ile 0.333333333 aynı anahtar', () => {
  const a = formulaKey({ hammadde: 'X', katman: 'Üst', katman_yuzde: 1 / 3, mutlak_yuzde: 10 })
  const b = formulaKey({ hammadde: 'X', katman: 'Üst', katman_yuzde: 0.333333333, mutlak_yuzde: 10 })
  assert.equal(a, b)
})

test('blockedFormulaSkus: sku boş hatalı formül satırı tüm formülü durdurur', () => {
  assert.deepEqual(blockedFormulaSkus([{ sheet: 'Formül', row: 5, message: 'x' }]), { all: true, skus: new Set() })
  const r = blockedFormulaSkus([{ sheet: 'Formül', row: 5, sku: 'A', message: 'x' }, { sheet: 'Ürünler', row: 2, message: 'y' }])
  assert.equal(r.all, false)
  assert.deepEqual([...r.skus], ['A'])
})

test('enforceShowcaseLimit: vitrin 10 ürünü geçemez', () => {
  const ups = ['A', 'B', 'C'].map((sku) => ({ sku, changes: { is_featured: [false, true] as [unknown, unknown] } }))
  const r = enforceShowcaseLimit(ups, { featured: 8, onSale: 0 })
  assert.deepEqual(r.updates.map((u) => u.sku), ['A', 'B'])
  assert.equal(r.issues.length, 1)
  assert.equal(r.issues[0].sku, 'C')
})

test('mergeImages: boşluklu görsel dizisi reddedilir, sıralı kabul', () => {
  assert.deepEqual(mergeImages(['a'], { gorsel_2: 'b' }), { images: ['a', 'b'] })
  assert.ok('error' in mergeImages([], { gorsel_3: 'c' }))
})
