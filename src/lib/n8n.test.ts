import test from 'node:test'
import assert from 'node:assert/strict'
import { webhookUrlFor } from './n8n'

test('sipariş kanalı: N8N_ORDER_WEBHOOK_URL tanımlıysa o kullanılır', () => {
  assert.equal(webhookUrlFor('order', { N8N_ORDER_WEBHOOK_URL: 'https://x/siparis', N8N_WEBHOOK_URL: 'https://x/b2b' }), 'https://x/siparis')
})
test('sipariş kanalı: ayrı adres yoksa genel adrese düşer', () => {
  assert.equal(webhookUrlFor('order', { N8N_WEBHOOK_URL: 'https://x/b2b' }), 'https://x/b2b')
})
test('genel kanal: sipariş adresi tanımlı olsa da N8N_WEBHOOK_URL kullanılır', () => {
  assert.equal(webhookUrlFor('default', { N8N_ORDER_WEBHOOK_URL: 'https://x/siparis', N8N_WEBHOOK_URL: 'https://x/b2b' }), 'https://x/b2b')
})
test('hiçbiri tanımlı değilse undefined, boş metin de tanımsız sayılır', () => {
  assert.equal(webhookUrlFor('order', {}), undefined)
  assert.equal(webhookUrlFor('order', { N8N_ORDER_WEBHOOK_URL: '  ', N8N_WEBHOOK_URL: '' }), undefined)
})
