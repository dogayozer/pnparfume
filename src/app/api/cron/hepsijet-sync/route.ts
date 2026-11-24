import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getHepsijetTracking } from '@/lib/hepsijet'
import {
  sendOrderShippedNotification,
  sendOrderDeliveredNotification,
  sendAffiliateCommissionNotification,
} from '@/lib/notifications/notificationEngine'

// HepsiJET gönderilerinin durumunu otomatik eşitler (Vercel Cron):
// kurye teslim aldı → "shipped" (+ kargo SMS'i), teslim edildi → "delivered" (+ komisyon, teslim SMS'i).
// Geri alma yok: yalnız ileri yönde ve her geçiş tek kez çalışır (durum koşulu bunu garanti eder).
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: {
      cargoCompany: 'HepsiJET',
      trackingCode: { not: null },
      status: { in: ['paid', 'processing', 'preparing', 'shipped'] },
    },
    include: { customer: true },
    take: 100,
  })

  let shipped = 0, delivered = 0, errors = 0
  for (const o of orders) {
    try {
      const t = await getHepsijetTracking(o.trackingCode!)
      if (!t) continue
      const phone = o.customerPhone || o.customer?.phone
      const name = o.customerName || 'Değerli Müşterimiz'

      if (t.deliveryStatus === 'DELIVERED') {
        const data: any = { status: 'delivered' }
        if (o.referrerId && !o.isCommissionPaid && o.affiliateEarned > 0) {
          const amb = await prisma.customer.update({
            where: { id: o.referrerId },
            data: {
              wallet_balance: { increment: o.affiliateEarned },
              earned_samples: o.b2bSamplesEarned > 0 ? { increment: o.b2bSamplesEarned } : undefined,
            },
          })
          data.isCommissionPaid = true
          try {
            await sendAffiliateCommissionNotification({
              ambassadorName: amb.name || 'Marka Elçimiz', phone: amb.phone, customerId: amb.id,
              earnedAmount: o.affiliateEarned, newWalletBalance: amb.wallet_balance,
            })
          } catch (e) { console.error('HepsiJET sync commission SMS error:', e) }
        }
        await prisma.order.update({ where: { id: o.id }, data })
        delivered++
        try {
          await sendOrderDeliveredNotification({
            orderNumber: o.orderNumber, customerName: name, phone, customerId: o.customerId, vipCouponCode: 'PN-VIP-15',
          })
        } catch (e) { console.error('HepsiJET sync delivered SMS error:', e) }
      } else if (t.moved && o.status !== 'shipped') {
        await prisma.order.update({ where: { id: o.id }, data: { status: 'shipped' } })
        shipped++
        try {
          await sendOrderShippedNotification({
            orderNumber: o.orderNumber, customerName: name, phone, customerId: o.customerId,
            cargoCompany: 'HepsiJET', trackingCode: o.trackingCode!,
          })
        } catch (e) { console.error('HepsiJET sync shipped SMS error:', e) }
      }
    } catch (e) {
      errors++
      console.error('HepsiJET sync error:', o.orderNumber, e)
    }
  }
  return NextResponse.json({ checked: orders.length, shipped, delivered, errors })
}
