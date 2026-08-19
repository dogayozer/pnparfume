import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
    const body = await req.json()
    const { orderId, status, cargoCompany, trackingCode, customerAddress } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Sipariş ID gereklidir' }, { status: 400 })
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId }
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
      await prisma.customer.update({
        where: { id: currentOrder.referrerId },
        data: {
          wallet_balance: { increment: currentOrder.affiliateEarned },
          earned_samples: currentOrder.b2bSamplesEarned > 0 ? { increment: currentOrder.b2bSamplesEarned } : undefined
        }
      })
      updateData.isCommissionPaid = true
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

    return NextResponse.json({
      message: 'Sipariş başarıyla güncellendi',
      order: updated
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Sipariş güncellenemedi' }, { status: 500 })
  }
}
