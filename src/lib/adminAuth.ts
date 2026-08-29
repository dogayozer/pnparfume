import { signToken, verifyToken, getBearerToken } from './sessionAuth'

const ADMIN_TTL_MS = 12 * 60 * 60 * 1000 // 12 saat

export function signAdminToken(adminId: string): string {
  return signToken({ type: 'admin', id: adminId }, ADMIN_TTL_MS)
}

/**
 * Bir admin API isteğinin geçerli, süresi dolmamış bir admin token'ı taşıyıp
 * taşımadığını doğrular. Geçersizse null döner — çağıran route bunu 401'e çevirmeli.
 */
export function requireAdmin(req: Request): { id: string } | null {
  const token = getBearerToken(req)
  const payload = verifyToken<{ type: string; id: string }>(token)
  if (!payload || payload.type !== 'admin') return null
  return { id: payload.id }
}
