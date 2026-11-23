import test from 'node:test'
import assert from 'node:assert/strict'
import { secondItemDiscount, cartDiscounts } from './pricingConstants'

test('tek ürün tek adet → indirim yok', () => {
  assert.equal(secondItemDiscount([{ price: 699, quantity: 1 }]), 0)
})
test('iki farklı ürün → 2. ürünün (ucuz olanın) %50\'si', () => {
  assert.equal(secondItemDiscount([{ price: 800, quantity: 1 }, { price: 600, quantity: 1 }]), 300)
})
test('sıra fark etmez', () => {
  assert.equal(secondItemDiscount([{ price: 600, quantity: 1 }, { price: 800, quantity: 1 }]), 300)
})
test('aynı üründen 2 adet → 2. adedin %50\'si', () => {
  assert.equal(secondItemDiscount([{ price: 699, quantity: 2 }]), 349)
})
test('üç ürün → yalnız bir kez, 2. en pahalının %50\'si', () => {
  assert.equal(secondItemDiscount([{ price: 900, quantity: 1 }, { price: 700, quantity: 1 }, { price: 500, quantity: 1 }]), 350)
})
test('boş sepet → 0', () => {
  assert.equal(secondItemDiscount([]), 0)
})
test('yüzde parametresi: %100 → ucuz ürün bedava', () => {
  assert.equal(secondItemDiscount([{ price: 800, quantity: 1 }, { price: 600, quantity: 1 }], 100), 600)
})

// ---- cartDiscounts: otomatik %50 kampanyası + kuponlar ----
const two = [{ price: 800, quantity: 1 }, { price: 600, quantity: 1 }]

test('kuponsuz: yalnız otomatik 2. ürün %50', () => {
  const d = cartDiscounts({ lines: two, isDealer: false })
  assert.deepEqual(d, { subtotal: 1400, multiItemDiscount: 300, couponDiscount: 0, couponApplies: false })
})
test('bayi: otomatik indirim yok', () => {
  assert.equal(cartDiscounts({ lines: two, isDealer: true }).multiItemDiscount, 0)
})
test('yüzde kuponu otomatik %50 ile birlikte uygulanır (eski davranış korunur)', () => {
  const d = cartDiscounts({ lines: two, isDealer: false, coupon: { type: 'percentage', value: 10 } })
  assert.equal(d.multiItemDiscount, 300)
  assert.equal(d.couponDiscount, 140)
  assert.equal(d.couponApplies, true)
})
test('sabit tutar kuponu', () => {
  const d = cartDiscounts({ lines: two, isDealer: false, coupon: { type: 'fixed', value: 100 } })
  assert.equal(d.couponDiscount, 100)
})
test('bogo kuponu: ucuz ürün bedava ve otomatik %50 DEVRE DIŞI (toplanmaz)', () => {
  const d = cartDiscounts({ lines: two, isDealer: false, coupon: { type: 'bogo', value: 100 } })
  assert.deepEqual(d, { subtotal: 1400, multiItemDiscount: 0, couponDiscount: 600, couponApplies: true })
})
test('bogo kuponu: aynı üründen 2 adet → ikinci adet bedava', () => {
  const d = cartDiscounts({ lines: [{ price: 699, quantity: 2 }], isDealer: false, coupon: { type: 'bogo', value: 100 } })
  assert.equal(d.couponDiscount, 699)
})
test('bogo kuponu: tek ürün → indirim yok, kupon uygulanmış sayılmaz', () => {
  const d = cartDiscounts({ lines: [{ price: 699, quantity: 1 }], isDealer: false, coupon: { type: 'bogo', value: 100 } })
  assert.deepEqual(d, { subtotal: 699, multiItemDiscount: 0, couponDiscount: 0, couponApplies: false })
})
test('bogo kuponu: bayide uygulanmaz', () => {
  const d = cartDiscounts({ lines: two, isDealer: true, coupon: { type: 'bogo', value: 100 } })
  assert.equal(d.couponDiscount, 0)
  assert.equal(d.couponApplies, false)
})
test('bogo: 3 ürün → yalnız bir kez, 2. en pahalı bedava', () => {
  const d = cartDiscounts({ lines: [{ price: 900, quantity: 1 }, { price: 700, quantity: 1 }, { price: 500, quantity: 1 }], isDealer: false, coupon: { type: 'bogo', value: 100 } })
  assert.equal(d.couponDiscount, 700)
})
