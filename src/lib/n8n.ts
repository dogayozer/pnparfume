// n8n'e olay bildirimi (form başvuruları, siparişler vb.). Adres tanımlı değilse hiçbir şey yapmaz.
// Mail gönderimini asla engellemez: hata yutulur, en çok 5 sn beklenir.
//
// İki kanal:
//   'default' → N8N_WEBHOOK_URL        (B2B form başvuruları: dealership_lead, distributor_lead)
//   'order'   → N8N_ORDER_WEBHOOK_URL  (sipariş olayları; tanımlı değilse N8N_WEBHOOK_URL'ye düşer)
export type N8nChannel = 'default' | 'order'

export function webhookUrlFor(channel: N8nChannel, env: Record<string, string | undefined> = process.env): string | undefined {
  const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined)
  const general = clean(env.N8N_WEBHOOK_URL)
  return channel === 'order' ? clean(env.N8N_ORDER_WEBHOOK_URL) ?? general : general
}

export async function notifyN8n(event: string, data: Record<string, unknown>, channel: N8nChannel = 'default'): Promise<void> {
  const url = webhookUrlFor(channel)
  if (!url) return
  try {
    const secret = process.env.N8N_WEBHOOK_SECRET
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Webhook-Secret': secret } : {}),
      },
      body: JSON.stringify({ event, site: 'pnparfume.com', at: new Date().toISOString(), data }),
      signal: AbortSignal.timeout(5000),
    })
  } catch (err) {
    console.error('n8n webhook hatası:', err)
  }
}
