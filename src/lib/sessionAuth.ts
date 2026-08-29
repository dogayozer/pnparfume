import crypto from 'crypto'

// Paylaşımlı, imzalı (HMAC-SHA256) oturum token'ı altyapısı — admin paneli ve müşteri
// hesabı API'lerinin ikisi de bunu kullanır. Önceden bu iki tarafta da token hiç
// doğrulanmıyordu: admin girişinde üretilen "token" rastgele bir string olup hiçbir
// yerde kontrol edilmiyordu, müşteri tarafında ise her istek client'ın gönderdiği
// userId'ye körü körüne güveniyordu (herkes başka bir müşterinin ID'sini yazıp onun
// verisini görebiliyor/değiştirebiliyordu). Bu dosya, o boşluğu kapatan imzalama/
// doğrulama fonksiyonlarını sağlar.

function getSecret(): string {
  const explicit = process.env.SESSION_SECRET
  if (explicit) return explicit

  // Vercel gibi serverless ortamlarda AYNI ANDA birden fazla sunucu örneği (lambda)
  // çalışabilir. Secret süreç başına rastgele üretilirse, bir örnekte imzalanan
  // token başka bir örnekte doğrulanamaz ve rastgele/aralıklı 401 hatalarına yol
  // açar. Bu yüzden ayrı bir SESSION_SECRET tanımlanana kadar, zaten Vercel'de
  // güvenli şekilde saklanan PAYTR_MERCHANT_SALT'tan türetilmiş SABİT bir secret
  // kullanılıyor (tüm sunucu örneklerinde aynı, ekstra kurulum gerektirmiyor).
  // ÜRETİMDE ÖNERİLEN: Vercel ortam değişkenlerine rastgele, uzun bir SESSION_SECRET
  // ekleyin — bu daha temiz ve PAYTR anahtarından bağımsız bir güvenlik sınırı sağlar.
  const seed = process.env.PAYTR_MERCHANT_SALT || process.env.DATABASE_URL || 'pn-parfum-insecure-default-LUTFEN-SESSION_SECRET-EKLEYIN'
  return crypto.createHash('sha256').update('pn-session-v1:' + seed).digest('hex')
}

const SECRET = getSecret()

export function signToken(payload: Record<string, any>, ttlMs: number): string {
  const body = JSON.stringify({ ...payload, exp: Date.now() + ttlMs })
  const bodyB64 = Buffer.from(body).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(bodyB64).digest('base64url')
  return `${bodyB64}.${sig}`
}

export function verifyToken<T = any>(token: string | null | undefined): T | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [bodyB64, sig] = parts

  const expectedSig = crypto.createHmac('sha256', SECRET).update(bodyB64).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  // Zamanlama saldırılarına karşı sabit-zamanlı karşılaştırma. Farklı uzunluktaki
  // buffer'larda timingSafeEqual hata fırlatır, önce onu eledik.
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(bodyB64, 'base64url').toString())
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null
    return payload as T
  } catch {
    return null
  }
}

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get('authorization') || ''
  return header.startsWith('Bearer ') ? header.slice(7) : null
}
