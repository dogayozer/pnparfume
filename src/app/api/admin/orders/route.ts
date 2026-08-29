import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  sendOrderShippedNotification, 
  sendOrderDeliveredNotification, 
  sendAffiliateCommissionNotification 
} from '@/lib/notifications/notificationEngine'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        },
        referrer: {
          select: { id: true, name: true, email: true, phone: true, referral_code: true, partner_type: true }
        },
        coupon: {
          select: { code: true, value: true, discount_type: true }
        }
      },
      take: 200
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json({ error: 'Siparişler getirilemedi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const body = await req.json()
    const { orderId, status, cargoCompany, trackingCode, customerAddress } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Sipariş ID gereklidir' }, { status: 400 })
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        referrer: true
      }
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (cargoCompany !== undefined) updateData.cargoCompany = cargoCompany
    if (trackingCode !== undefined) updateData.trackingCode = trackingCode
    if (customerAddress !== undefined) updateData.customerAddress = customerAddress

    // Check if status changed to 'delivered' and commission needs to be paid
    if ((status === 'delivered' || status === 'paid') && currentOrder.referrerId && !currentOrder.isCommissionPaid && currentOrder.affiliateEarned > 0) {
      // Pay commission to ambassador
      const updatedAmbassador = await prisma.customer.update({
        where: { id: currentOrder.referrerId },
        data: {
          wallet_balance: { increment: currentOrder.affiliateEarned },
          earned_samples: currentOrder.b2bSamplesEarned > 0 ? { increment: currentOrder.b2bSamplesEarned } : undefined
        }
      })
      updateData.isCommissionPaid = true

      // Send Affiliate Commission Notification
      try {
        await sendAffiliateCommissionNotification({
          ambassadorName: updatedAmbassador.name || 'Marka Elçimiz',
          phone: updatedAmbassador.phone,
          customerId: updatedAmbassador.id,
          earnedAmount: currentOrder.affiliateEarned,
          newWalletBalance: updatedAmbassador.wallet_balance
        })
      } catch (e) {
        console.error('Affiliate commission notification error:', e)
      }
    }

    // 🔴 Refund or Cancellation: Revert affiliate commission if previously paid
    if ((status === 'refunded' || status === 'cancelled') && currentOrder.referrerId && currentOrder.isCommissionPaid && currentOrder.affiliateEarned > 0) {
      try {
        await prisma.customer.update({
          where: { id: currentOrder.referrerId },
          data: {
            wallet_balance: { decrement: currentOrder.affiliateEarned }
          }
        })
        updateData.isCommissionPaid = false
      } catch (e) {
        console.error('Commission rollback error on refund:', e)
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        },
        referrer: {
          select: { id: true, name: true, email: true, phone: true, referral_code: true }
        },
        coupon: {
          select: { code: true, value: true, discount_type: true }
        }
      }
    })

    // Automated Notification Triggers:
    // 1. Shipped trigger
    if ((status === 'shipped' || (trackingCode && currentOrder.status !== 'shipped')) && trackingCode) {
      try {
        await sendOrderShippedNotification({
          orderNumber: currentOrder.orderNumber,
          customerName: currentOrder.customerName || 'Değerli Müşterimiz',
          phone: currentOrder.customerPhone || currentOrder.customer?.phone,
          customerId: currentOrder.customerId,
          cargoCompany: cargoCompany || currentOrder.cargoCompany || 'Yurtiçi Kargo',
          trackingCode: trackingCode
        })
      } catch (e) {
        console.error('Shipped notification error:', e)
      }
    }

    // 2. Delivered trigger
    if (status === 'delivered' && currentOrder.status !== 'delivered') {
      try {
        await sendOrderDeliveredNotification({
          orderNumber: currentOrder.orderNumber,
          customerName: currentOrder.customerName || 'Değerli Müşterimiz',
          phone: currentOrder.customerPhone || currentOrder.customer?.phone,
          customerId: currentOrder.customerId,
          vipCouponCode: 'PN-VIP-15'
        })
      } catch (e) {
        console.error('Delivered notification error:', e)
      }
    }

    return NextResponse.json({
      message: 'Sipariş başarıyla güncellendi ve bildirimler tetiklendi',
      order: updated
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Sipariş güncellenemedi' }, { status: 500 })
  }
}
