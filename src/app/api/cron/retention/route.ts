import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification, sendBirthdayNotification } from '@/lib/notifications/notificationEngine'

// Vercel Cron / Nightly Retention, Birthday Automation & DB Log Archiving Route
export async function GET(request: Request) {
  // Vercel Cron istekleri otomatik olarak "Authorization: Bearer <CRON_SECRET>" gönderir.
  // CRON_SECRET tanımlıysa doğrulanır; tanımlı değilse (henüz kurulmadıysa) eskisi gibi
  // açık kalır — CRON_SECRET eklenene kadar bu route'u herkes tetikleyebilir, bilerek.
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }
  }

  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    let refillNotifsCreated = 0;
    let birthdayNotifsCreated = 0;
    let archivedLogsCount = 0;

    // -------------------------------------------------------------
    // 1. 45. GÜN PARFÜM YENİLEME HATIRLATICISI
    // -------------------------------------------------------------
    const fortyFiveDaysAgoStart = new Date(today.getTime() - (45 * 24 * 60 * 60 * 1000));
    fortyFiveDaysAgoStart.setHours(0, 0, 0, 0);
    
    const fortyFiveDaysAgoEnd = new Date(fortyFiveDaysAgoStart);
    fortyFiveDaysAgoEnd.setHours(23, 59, 59, 999);

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

    for (const order of oldOrders) {
      if (order.customerId) {
        const existingNotif = await prisma.notification.findFirst({
          where: {
            customerId: order.customerId,
            trigger_reason: 'refill_reminder',
            createdAt: { gte: fortyFiveDaysAgoStart }
          }
        });

        if (!existingNotif) {
          const newCoupon = await prisma.coupon.create({
            data: {
              code: `YENILE-${order.customer?.name?.substring(0,3).toUpperCase() || 'PN'}-${Math.floor(1000 + Math.random() * 9000)}`,
              discount_type: 'percentage',
              value: 10,
              ownerId: order.customerId,
              source: 'system',
              is_active: true,
              usage_limit: 1,
              expiresAt: new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000))
            }
          });

          // ÖNCEDEN burada doğrudan prisma.notification.create({ status: 'sent' })
          // yazılıyordu — NETGSM'e hiç istek atmadan veritabanına "gönderildi" diye
          // YALAN kayıt düşülüyordu. sendNotification() hem gerçek gönderimi dener
          // hem de gerçek sonuca göre (sent/failed/simulated) doğru logu yazıyor.
          try {
            await sendNotification({
              phone: order.customerPhone || order.customer?.phone,
              customerId: order.customerId,
              orderNumber: order.orderNumber,
              type: 'sms',
              triggerReason: 'refill_reminder',
              message: `Merhaba ${order.customer?.name || 'Değerli Müşterimiz'}, imza parfümünüz bitmek üzere olmalı. Sizin için tanımladığımız ${newCoupon.code} koduyla %10 indirimli olarak hemen yenileyebilirsiniz: https://pnparfume.com`
            })
          } catch (smsErr) {
            console.error(`Refill reminder SMS dispatch error for customer ${order.customerId}:`, smsErr)
          }

          refillNotifsCreated++;
        }
      }
    }

    // -------------------------------------------------------------
    // 2. DOĞUM AYI / DOĞUM GÜNÜ VIP KAMPANYA OTOMASYONU
    // -------------------------------------------------------------
    const birthdayCustomers = await prisma.customer.findMany({
      where: {
        birth_month: currentMonth,
        sms_opt_in: true
      }
    });

    const oneYearAgo = new Date(today.getTime() - (300 * 24 * 60 * 60 * 1000));

    for (const cust of birthdayCustomers) {
      // Check if already received birthday coupon in the last 300 days
      const existingBdayNotif = await prisma.notification.findFirst({
        where: {
          customerId: cust.id,
          trigger_reason: 'custom',
          createdAt: { gte: oneYearAgo }
        }
      });

      if (!existingBdayNotif) {
        const bdayCode = `VIPDOGUM-${cust.name.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        await prisma.coupon.create({
          data: {
            code: bdayCode,
            discount_type: 'percentage',
            value: 20,
            ownerId: cust.id,
            source: 'system',
            is_active: true,
            usage_limit: 1,
            expiresAt: new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 gün geçerli
          }
        });

        try {
          await sendBirthdayNotification({
            customerName: cust.name,
            phone: cust.phone,
            customerId: cust.id,
            couponCode: bdayCode,
            discountPercent: 20
          });
          birthdayNotifsCreated++;
        } catch (smsErr) {
          console.error(`Birthday SMS dispatch error for ${cust.name}:`, smsErr);
        }
      }
    }

    // -------------------------------------------------------------
    // 3. 90 GÜNDEN ESKİ BİLDİRİM LOGLARINI ARŞİVLEME / TEMİZLEME (Neon Storage & Index Tasarrufu)
    // -------------------------------------------------------------
    const ninetyDaysAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
    const deleteResult = await prisma.notification.deleteMany({
      where: {
        status: 'sent',
        createdAt: { lte: ninetyDaysAgo }
      }
    });
    archivedLogsCount = deleteResult.count;

    return NextResponse.json({ 
      success: true, 
      message: `Cron tamamlandı: ${refillNotifsCreated} adet parfüm yenileme, ${birthdayNotifsCreated} adet Doğum Günü VIP SMS'i ve ${archivedLogsCount} adet eski bildirim logu temizlendi.` 
    });
    
  } catch (error: any) {
    console.error('Retention Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
