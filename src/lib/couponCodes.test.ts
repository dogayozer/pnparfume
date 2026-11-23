import test from 'node:test'
import assert from 'node:assert/strict'
import { generateCouponCode, normalizePhone, COUPON_ALPHABET, phoneKey, headerKey } from './couponCodes'

test('phoneKey: Türk cep telefonu normalleşir, yurt dışı ve sabit hat rakam olarak anahtarlanır', () => {
  assert.equal(phoneKey('+90 545 682 10 75'), '905456821075')
  assert.equal(phoneKey('+994 50 123 45 67'), '994501234567')
  assert.equal(phoneKey('0212 123 45 67'), '2121234567')
})
test('phoneKey: 8 haneden kısa veya boş → null', () => {
  assert.equal(phoneKey(''), null)
  assert.equal(phoneKey('1234567'), null)
})
test('headerKey: Türkçe büyük İ doğru küçülür', () => {
  assert.equal(headerKey(' İsim '), 'isim')
  assert.equal(headerKey('Kampanya Kodu'), 'kampanya kodu')
  assert.equal(headerKey('Statü'), 'statü')
})

test('kod biçimi: PN25- + 8 karakter, karıştırılan harfler yok', () => {
  for (let i = 0; i < 200; i++) {
    const c = generateCouponCode('PN25-')
    assert.match(c, /^PN25-[A-Z2-9]{8}$/)
    assert.ok(!/[01OIL]/.test(c.slice(5)))
  }
})
test('alfabe 0,1,O,I,L içermez', () => {
  assert.ok(!/[01OIL]/.test(COUPON_ALPHABET))
})
test('rastgelelik: 1000 kod hepsi farklı', () => {
  const s = new Set(Array.from({ length: 1000 }, () => generateCouponCode('PN25-')))
  assert.equal(s.size, 1000)
})
test('normalizePhone: +90 545 682 10 75 → 905456821075', () => {
  assert.equal(normalizePhone('+90 545 682 10 75'), '905456821075')
})
test('normalizePhone: 0545... ve 545... aynı sonuç', () => {
  assert.equal(normalizePhone('0545 682 10 75'), '905456821075')
  assert.equal(normalizePhone('545 682 10 75'), '905456821075')
})
test('normalizePhone: boş veya geçersiz → null', () => {
  assert.equal(normalizePhone(''), null)
  assert.equal(normalizePhone('abc'), null)
  assert.equal(normalizePhone('12345'), null)
})
