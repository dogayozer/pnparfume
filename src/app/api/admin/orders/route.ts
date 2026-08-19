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

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (cargoCompany !== undefined) updateData.cargoCompany = cargoCompany
    if (trackingCode !== undefined) updateData.trackingCode = trackingCode
    if (customerAddress !== undefined) updateData.customerAddress = customerAddress

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true }
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
