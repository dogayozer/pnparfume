import { prisma } from '@/lib/prisma'

// Kuponu "kullanıldı" sayar. ÖDEME ONAYLANINCA çağrılır (kart: PayTR callback; havale: yönetici "Ödeme Alındı"):
// ödeme yapılmadan terk edilen sepetler kuponu yakmasın diye kupon sipariş oluşurken değil, ödenince düşer.
// Tek atomik UPDATE: limit doluysa 0 satır etkilenir (false döner). Ödenmiş sipariş yine de geçerlidir.
export async function consumeCoupon(couponId: string): Promise<boolean> {
  const affected = await prisma.$executeRaw`
    UPDATE "Coupon" SET "usage_count" = "usage_count" + 1
    WHERE "id" = ${couponId} AND ("usage_limit" IS NULL OR "usage_count" < "usage_limit")`
  return affected > 0
}
