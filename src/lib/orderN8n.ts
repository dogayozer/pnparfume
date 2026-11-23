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

export function orderEventData(o: OrderEventInput) {
  const items = Array.isArray(o.items) ? (o.items as { sku?: unknown; quantity?: unknown; price?: unknown }[]) : []
  const itemsText = items
    .map((i) => `${Number(i.quantity) || 1} x ${productLabel(String(i.sku ?? ''))} — ${Number(i.price) || 0} TL`)
    .join('\n')
  return {
    orderNumber: o.orderNumber,
    totalAmount: o.totalAmount,
    currency: 'TRY',
    paymentMethod: o.paymentMethod,
    customerName: o.customerName ?? '',
    customerPhone: o.customerPhone ?? '',
    customerEmail: o.customerEmail ?? '',
    customerAddress: o.customerAddress ?? '',
    customerNote: String(o.customerNote ?? '').trim(),
    itemCount: items.reduce((n, i) => n + (Number(i.quantity) || 1), 0),
    itemsText,
  }
}

export async function notifyOrderN8n(event: OrderEventName, o: OrderEventInput): Promise<void> {
  await notifyN8n(event, orderEventData(o))
}
