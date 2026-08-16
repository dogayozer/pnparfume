import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { name: true, email: true }
        },
        coupon: {
          select: { code: true }
        }
      },
      take: 100 // Son 100 sipariş
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Siparişler getirilemedi' }, { status: 500 })
  }
}
