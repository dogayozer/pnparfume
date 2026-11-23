import { randomInt } from 'node:crypto'

// Kişiye özel kupon kodları: kriptografik rastgele, karıştırılan harfler (0, 1, O, I, L) yok.
export const COUPON_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateCouponCode(prefix: string, length = 8): string {
  let s = ''
  for (let i = 0; i < length; i++) s += COUPON_ALPHABET[randomInt(COUPON_ALPHABET.length)]
  return prefix + s
}

// Kişi anahtarı: Türk cep telefonu 90xxxxxxxxxx'e normalleşir; yurt dışı/sabit hat numaraları rakam olarak (en az 8 hane) anahtarlanır.
export function phoneKey(raw: unknown): string | null {
  const n = normalizePhone(raw)
  if (n) return n
  const digits = String(raw ?? '').replace(/\D/g, '').replace(/^0+/, '')
  return digits.length >= 8 ? digits : null
}

// Excel başlıklarını Türkçe harflere uygun küçültür ("İsim" → "isim").
export function headerKey(h: unknown): string {
  return String(h ?? '').trim().toLocaleLowerCase('tr').normalize('NFC')
}

// Türkiye cep telefonunu 90xxxxxxxxxx biçimine getirir; geçersizse null.
export function normalizePhone(raw: unknown): string | null {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (!digits) return null
  let d = digits
  if (d.startsWith('90') && d.length === 12) d = d.slice(2)
  else if (d.startsWith('0') && d.length === 11) d = d.slice(1)
  return /^5\d{9}$/.test(d) ? '90' + d : null
}
