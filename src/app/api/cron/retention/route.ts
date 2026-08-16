import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Bu route'un Vercel veya AWS üzerinde her gece 00:00'da tetikleneceği varsayılır (Cron-Job)
export async function GET(request: Request) {
  try {
    // Güvenlik: Sadece yetkili cron servisinin bu URL'yi çağırabildiğinden emin olmak için secret kontrolü yapılabilir.
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Bugünün tarihi ve tam 45 gün öncesinin başlangıç ve bitiş zamanı
    const today = new Date();
    const fortyFiveDaysAgoStart = new Date(today.getTime() - (45 * 24 * 60 * 60 * 1000));
    fortyFiveDaysAgoStart.setHours(0, 0, 0, 0);
    
    const fortyFiveDaysAgoEnd = new Date(fortyFiveDaysAgoStart);
    fortyFiveDaysAgoEnd.setHours(23, 59, 59, 999);

    // Tam 45 gün önce tamamlanmış (shipped veya delivered) siparişleri bul
    const oldOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: fortyFiveDaysAgoStart,
          lte: fortyFiveDaysAgoEnd,
        },
        status: { in: ['shipped', 'delivered'] },
        customerId: { not: null }
      },
      include: {
        customer: true
      }
    });

    let notificationsCreated = 0;

    for (const order of oldOrders) {
      if (order.customerId) {
        // Zaten bu sipariş/müşteri için daha önce bir hatırlatma gönderilmiş mi kontrolü
        const existingNotif = await prisma.notification.findFirst({
          where: {
            customerId: order.customerId,
            trigger_reason: 'refill_reminder',
            createdAt: { gte: fortyFiveDaysAgoStart }
          }
        });

        if (!existingNotif) {
          // Özel %10 İndirim Kuponu Oluştur (Sadece bu müşteriye özel)
          const newCoupon = await prisma.coupon.create({
            data: {
              code: `YENILE-${order.customer?.name?.substring(0,3).toUpperCase() || 'PN'}-${Math.floor(1000 + Math.random() * 9000)}`,
              discount_type: 'percentage',
              value: 10,
              ownerId: order.customerId,
              source: 'system',
              is_active: true,
              usage_limit: 1,
              expiresAt: new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 gün geçerli
            }
          });

          // Bildirim oluştur
          await prisma.notification.create({
            data: {
              customerId: order.customerId,
              type: 'email', // Ya da SMS/Whatsapp
              message_content: `Merhaba ${order.customer?.name || ''}, imza parfümünüz bitmek üzere olmalı. Sizin için oluşturduğumuz ${newCoupon.code} koduyla %10 indirimli olarak hemen yenileyebilirsiniz.`,
              trigger_reason: 'refill_reminder',
              status: 'pending',
              scheduledFor: today
            }
          });

          notificationsCreated++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${notificationsCreated} adet 45. gün parfüm yenileme (retention) bildirimi sıraya alındı.` 
    });
    
  } catch (error) {
    console.error('Retention Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
