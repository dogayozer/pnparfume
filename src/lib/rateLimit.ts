// Basit, bellek-içi (in-memory) IP bazlı rate limiter. Vercel'in tekil bir
// lambda örneği içinde çalışır — birden fazla örnek arasında paylaşılmaz,
// yani tavan gerçek sınırın biraz üzerinde olabilir; ama amaç mükemmel bir
// kota değil, LLM maliyeti/DoS'u kabaca frenlemek (bkz. /api/similar-match,
// /api/wizard-match — daha önce hiç limiti yoktu, Vercel Fair-Use aşımıyla
// yaşanan kesintiyle aynı risk sınıfı).
const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = buckets.get(key)

  if (!record || now > record.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count += 1
  return true
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown-ip'
}
