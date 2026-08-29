import { signToken, verifyToken, getBearerToken } from './sessionAuth'

const CUSTOMER_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 gün

export function signCustomerToken(customerId: string): string {
  return signToken({ type: 'customer', id: customerId }, CUSTOMER_TTL_MS)
}

/**
 * İsteğin geçerli bir müşteri token'ı taşıdığını doğrular. `expectedId` verilirse,
 * token'ın İÇİNDEKİ id ile eşleşmesi de şart koşulur — yani istek gövdesinde farklı
 * bir userId gönderilse bile (eski IDOR açığı), token sahibinin GERÇEK kimliği dışında
 * bir hesaba asla erişilemez.
 */
export function requireCustomer(req: Request, expectedId?: string): { id: string } | null {
  const token = getBearerToken(req)
  const payload = verifyToken<{ type: string; id: string }>(token)
  if (!payload || payload.type !== 'customer') return null
  if (expectedId && payload.id !== expectedId) return null
  return { id: payload.id }
}
