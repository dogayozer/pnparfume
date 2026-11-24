import test from 'node:test'
import assert from 'node:assert/strict'
import { getCollectionBySku, collectionScope, getCollection, productLabel } from './collections'

test('getCollectionBySku: en uzun önek kazanır (Pien / Intense / LUX / Creative / PN)', () => {
  assert.equal(getCollectionBySku('Pien M 1')?.slug, 'pien')
  assert.equal(getCollectionBySku('Pien W 103')?.slug, 'pien')
  assert.equal(getCollectionBySku('Pien Intense RX54')?.slug, 'pien-intense')
  assert.equal(getCollectionBySku('Pien Intense 558')?.slug, 'pien-intense')
  assert.equal(getCollectionBySku('Pien LUX M 13')?.slug, 'pien-luxury')
  assert.equal(getCollectionBySku('Pien LUX UNI 7')?.slug, 'pien-luxury')
  assert.equal(getCollectionBySku('CS-E-ARO-01')?.slug, 'pien-creative')
  assert.equal(getCollectionBySku('M 12'), undefined)
})

test('collectionScope(pien): Intense ve LUX ürünlerini dışlar, kendi önekini korur', () => {
  const scope = collectionScope(getCollection('pien')!) as any
  assert.deepEqual(scope.sku, { startsWith: 'Pien ' })
  const excluded = JSON.stringify(scope.NOT)
  assert.ok(excluded.includes('Pien Intense '))
  assert.ok(excluded.includes('Pien LUX '))
})

test('collectionScope(pien-intense): yalnız kendi öneki, dışlama yok', () => {
  const scope = collectionScope(getCollection('pien-intense')!) as any
  assert.deepEqual(scope.sku, { startsWith: 'Pien Intense ' })
  assert.equal(scope.NOT, undefined)
})

test('productLabel: Intense ve LUX SKU olduğu gibi gösterilir (önek eklenmez)', () => {
  assert.equal(productLabel('Pien Intense RX54'), 'Pien Intense RX54')
  assert.equal(productLabel('Pien LUX M 13'), 'Pien LUX M 13')
  assert.equal(productLabel('M 12'), 'PN M 12')
})

test('sabit hacimli koleksiyonlar: Intense 60 ml EDP, Luxury 100 ml Extrait', () => {
  assert.match(getCollection('pien-intense')!.fixed!.volumeLabel, /60 ml.*Eau de Parfum/)
  assert.match(getCollection('pien-luxury')!.fixed!.volumeLabel, /100 ml.*Extrait/)
  assert.equal(getCollection('pien')!.fixed, undefined)
})
