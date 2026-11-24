import test from 'node:test'
import assert from 'node:assert/strict'
import { splitCityDistrict } from './trAddress'
import { buildDeliveryBody, splitName } from './hepsijet'

test('splitCityDistrict: "İlçe/İl" sonlu adres', () => {
  assert.deepEqual(splitCityDistrict('Mimar Sinan Mah. Akarsu Sok. No:4/A Silivri/İstanbul'), { city: 'İstanbul', district: 'Silivri' })
})
test('splitCityDistrict: virgüllü ve küçük harfli', () => {
  assert.deepEqual(splitCityDistrict('Atatürk Cad. No 12 Daire 3, kadıköy, istanbul'), { city: 'İstanbul', district: 'Kadıköy' })
})
test('splitCityDistrict: Türkçe karakter olmadan yazılmış il', () => {
  assert.equal(splitCityDistrict('Cumhuriyet Mah. 5. Sok. No:8 Cankaya Ankara').city, 'Ankara')
  assert.equal(splitCityDistrict('Cumhuriyet Mah. 5. Sok. No:8 Cankaya Ankara').district, 'Cankaya')
  assert.equal(splitCityDistrict('Sarıyer, Istanbul').city, 'İstanbul')
})
test('splitCityDistrict: il adı sokakta geçse de son geçen il kullanılır', () => {
  assert.equal(splitCityDistrict('Ankara Cad. No:5 Bornova İzmir').city, 'İzmir')
})
test('splitCityDistrict: il bulunamazsa boş döner (admin elle girer)', () => {
  assert.deepEqual(splitCityDistrict('Atatürk Caddesi No 5'), { city: '', district: '' })
  assert.deepEqual(splitCityDistrict(''), { city: '', district: '' })
})
test('splitCityDistrict: ilçe yerine adres parçası/rakam gelirse ilçe boş kalır', () => {
  assert.equal(splitCityDistrict('Menekşe Sok. No:4 İstanbul').district, '')
})

test('splitName: son kelime soyad', () => {
  assert.deepEqual(splitName('Ayşe Nur Yılmaz'), { firstName: 'Ayşe Nur', lastName: 'Yılmaz' })
  assert.deepEqual(splitName('Tek'), { firstName: 'Tek', lastName: '' })
})

test('buildDeliveryBody: HepsiJET STD/RETAIL gövdesi, sipariş no = barkod, gönderici sabitleri', () => {
  const b: any = buildDeliveryBody(
    { orderNumber: 'PN1700000000000123', customerName: 'Ayşe Yılmaz', customerPhone: '905551112233', customerEmail: 'a@b.co', shippingCity: 'İstanbul', shippingDistrict: 'Kadıköy', shippingAddress: 'Test Mah. No:1' },
    '2026-11-24'
  )
  assert.equal(b.delivery.customerDeliveryNo, 'PN1700000000000123')
  assert.equal(b.delivery.deliveryType, 'RETAIL')
  assert.equal(b.delivery.product.productCode, 'HX_STD')
  assert.equal(b.delivery.recipientAddress.city.name, 'İstanbul')
  assert.equal(b.delivery.recipientAddress.town.name, 'Kadıköy')
  assert.equal(b.delivery.receiver.firstName, 'Ayşe')
  assert.equal(b.delivery.receiver.lastName, 'Yılmaz')
  assert.equal(b.company.abbreviationCode, 'PİENPARF')
  assert.equal(b.currentXDock.abbreviationCode, 'PIENPARFSILIVRI')
  assert.equal(b.delivery.senderAddress.companyAddressId, 'pien-pienparf-428')
})

test('kimlik bilgisi koda gömülü değil', async () => {
  const fs = await import('node:fs')
  const src = fs.readFileSync(new URL('./hepsijet.ts', import.meta.url), 'utf8')
  assert.ok(!/pien_integration/.test(src))
  assert.ok(!/T!SO/.test(src))
})
