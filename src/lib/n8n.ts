// n8n'e olay bildirimi (form başvuruları vb.). N8N_WEBHOOK_URL tanımlı değilse hiçbir şey yapmaz.
// Mail gönderimini asla engellemez: hata yutulur, en çok 5 sn beklenir.
export async function notifyN8n(event: string, data: Record<string, unknown>): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL
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
