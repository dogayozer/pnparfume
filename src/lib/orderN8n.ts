import { notifyN8n } from '@/lib/n8n'
import { productLabel } from '@/lib/collections'

// Yurt içi sipariş olayları n8n'e gider (muhasebeye WhatsApp bildirimi n8n tarafında kurulur).
//   order_paid              → kart ödemesi onaylandı VEYA yönetici havaleyi "Ödeme Alındı" yaptı
//   order_awaiting_transfer → havale/EFT siparişi oluştu, ödeme bekleniyor
// (Yurt dışı siparişler mevcut 'international_order' olayıyla gider.)
export type OrderEventName = 'order_paid' | 'order_awaiting_transfer'

export type OrderEventInput = {
  orderNumber: string
  totalAmount: number
  paymentMethod: 'card' | 'bank_transfer'
  customerName?: string | null
  customerPhone?: string | null
  customerEmail?: string | null
  customerAddress?: string | null
  customerNote?: string | null
  items?: unknown
}

// Muhasebe WhatsApp şablonu için okunur ödeme metni. Havale bekleyen siparişte "gönderim yapmayın" uyarısı içerir.
export function paymentLabel(event: OrderEventName, method: OrderEventInput['paymentMethod']): string {
  if (event === 'order_awaiting_transfer') return 'Havale/EFT (ÖDEME BEKLENİYOR, gönderim yapmayın)'
  return method === 'card' ? 'Kredi kartı (ödeme alındı)' : 'Havale/EFT (ödeme alındı)'
}

// WhatsApp şablon değişkenleri satır sonu içeremez: *Inline alanlar tek satırlıdır.
const oneLine = (v: string) => v.replace(/\s*[\r\n]+\s*/g, ' ').trim()

export function orderEventData(o: OrderEventInput, event?: OrderEventName) {
  const items = Array.isArray(o.items) ? (o.items as { sku?: unknown; quantity?: unknown; price?: unknown }[]) : []
  const itemsText = items
    .map((i) => `${Number(i.quantity) || 1} x ${productLabel(String(i.sku ?? ''))} — ${Number(i.price) || 0} TL`)
    .join('\n')
  const note = String(o.customerNote ?? '').trim()
  return {
    paymentLabel: event ? paymentLabel(event, o.paymentMethod) : '',
    totalText: `${o.totalAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL`,
    itemsInline: itemsText.split('\n').filter(Boolean).join('; '),
    customerNoteInline: oneLine(note),
    customerAddressInline: oneLine(o.customerAddress ?? ''),
    orderNumber: o.orderNumber,
    totalAmount: o.totalAmount,
    currency: 'TRY',
    paymentMethod: o.paymentMethod,
    customerName: o.customerName ?? '',
    customerPhone: o.customerPhone ?? '',
    customerEmail: o.customerEmail ?? '',
    customerAddress: o.customerAddress ?? '',
    customerNote: note,
    itemCount: items.reduce((n, i) => n + (Number(i.quantity) || 1), 0),
    itemsText,
  }
}

export async function notifyOrderN8n(event: OrderEventName, o: OrderEventInput): Promise<void> {
  await notifyN8n(event, orderEventData(o, event), 'order')
}
