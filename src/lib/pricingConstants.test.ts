import test from 'node:test'
import assert from 'node:assert/strict'
import { secondItemDiscount } from './pricingConstants'

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
