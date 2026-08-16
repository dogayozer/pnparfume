import { prisma } from './prisma'

interface FraudCheckResult {
  isSafe: boolean;
  reason?: string;
}

export class FraudControlService {
  /**
   * Kural 1: Kullanıcı kendi kodunu kullanarak (Self-referral) sipariş vermeye çalışıyor mu?
   */
  static async checkSelfReferral(customerId: string, couponCode: string): Promise<FraudCheckResult> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { referral_code: true }
    });

    if (customer?.referral_code === couponCode) {
      return { isSafe: false, reason: 'Kendi referans kodunuzu kullanamazsınız.' };
    }

    return { isSafe: true };
  }

  /**
   * Kural 2: Aynı IP veya Cihazdan kısa sürede çok fazla farklı hesapla kupon kullanımı var mı?
   */
  static async checkSuspiciousActivity(ipAddress: string, deviceFingerprint: string, couponId: string): Promise<FraudCheckResult> {
    // Son 24 saat içinde bu cihaz/IP üzerinden kaç kez aynı kupon kullanılmış?
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const usageCount = await prisma.couponUsage.count({
      where: {
        couponId,
        usedAt: { gte: twentyFourHoursAgo },
        OR: [
          { ip_address: ipAddress },
          { device_fingerprint: deviceFingerprint }
        ]
      }
    });

    // Eğer aynı cihazdan/IP'den aynı referans kodu 3'ten fazla kullanılmışsa (Farklı hesaplar açılmış olabilir)
    if (usageCount >= 3) {
      return { isSafe: false, reason: 'Şüpheli aktivite: Bu cihaz/IP üzerinden kullanım limitine ulaşıldı.' };
    }

    return { isSafe: true };
  }

  /**
   * Kupon kullanımını IP ve Cihaz verisiyle birlikte kaydeder
   */
  static async logCouponUsage(couponId: string, customerId: string | null, orderId: string, ipAddress: string, deviceFingerprint: string) {
    await prisma.couponUsage.create({
      data: {
        couponId,
        customerId,
        orderId,
        ip_address: ipAddress,
        device_fingerprint: deviceFingerprint
      }
    });
  }
}
