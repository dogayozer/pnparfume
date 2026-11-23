import test from 'node:test'
import assert from 'node:assert/strict'
import { orderEventData, paymentLabel } from './orderN8n'

const base = {
  orderNumber: 'PN-1001', totalAmount: 1048, paymentMethod: 'card' as const,
  customerName: 'Ayşe Yılmaz', customerPhone: '05551112233', customerEmail: 'a@b.com', customerAddress: 'Silivri / İstanbul',
  customerNote: '  Kapıya bırakın  ',
  items: [{ sku: 'Pien M 1', quantity: 2, price: 599 }, { sku: 'M 81', quantity: 1, price: 699 }],
}

test('ürün satırları koleksiyon etiketiyle yazılır (PN Pien M 1 değil)', () => {
  const d = orderEventData(base)
  assert.equal(d.itemsText, '2 x Pien M 1 — 599 TL\n1 x PN M 81 — 699 TL')
  assert.equal(d.itemCount, 3)
})
test('temel alanlar ve not kırpılır', () => {
  const d = orderEventData(base)
  assert.equal(d.orderNumber, 'PN-1001')
  assert.equal(d.totalAmount, 1048)
  assert.equal(d.paymentMethod, 'card')
  assert.equal(d.customerNote, 'Kapıya bırakın')
})
test('havale siparişi paymentMethod korunur', () => {
  assert.equal(orderEventData({ ...base, paymentMethod: 'bank_transfer' }).paymentMethod, 'bank_transfer')
})
test('items yoksa ya da bozuksa boş metin, çökme yok', () => {
  assert.equal(orderEventData({ ...base, items: undefined }).itemsText, '')
  assert.equal(orderEventData({ ...base, items: 'bozuk' as unknown as never }).itemCount, 0)
})
test('eksik müşteri alanları boş metin olur', () => {
  const d = orderEventData({ orderNumber: 'X', totalAmount: 5, paymentMethod: 'card' })
  assert.equal(d.customerName, '')
  assert.equal(d.customerNote, '')
})

test('itemsInline: satır sonu yok, noktalı virgülle ayrılır (WhatsApp şablon değişkeni için)', () => {
  const d = orderEventData(base)
  assert.equal(d.itemsInline, '2 x Pien M 1 — 599 TL; 1 x PN M 81 — 699 TL')
  assert.ok(!d.itemsInline.includes('\n'))
})
test('totalText Türkçe biçimli', () => {
  assert.equal(orderEventData(base).totalText, '1.048 TL')
  assert.equal(orderEventData({ ...base, totalAmount: 1250.5 }).totalText, '1.250,5 TL')
})
test('paymentLabel olaya ve yönteme göre', () => {
  assert.equal(paymentLabel('order_paid', 'card'), 'Kredi kartı (ödeme alındı)')
  assert.equal(paymentLabel('order_paid', 'bank_transfer'), 'Havale/EFT (ödeme alındı)')
  assert.equal(paymentLabel('order_awaiting_transfer', 'bank_transfer'), 'Havale/EFT (ÖDEME BEKLENİYOR, gönderim yapmayın)')
})
test('orderEventData olay verilirse paymentLabel eklenir', () => {
  assert.equal(orderEventData(base, 'order_paid').paymentLabel, 'Kredi kartı (ödeme alındı)')
})
test('adres ve not satır sonlarından arındırılmış tek satırlık alanlar da gelir', () => {
  const d = orderEventData({ ...base, customerNote: 'a\nb', customerAddress: 'x\ny' })
  assert.equal(d.customerNoteInline, 'a b')
  assert.equal(d.customerAddressInline, 'x y')
})
