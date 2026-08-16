import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    if (password !== 'Pds135596') {
      return NextResponse.json({ error: 'Hatalı şifre' }, { status: 401 })
    }

    const totalOrders = await prisma.order.count()
    const totalCoupons = await prisma.coupon.count()
    const aiAssistedOrders = await prisma.order.count({ where: { ai_assisted: true } })

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { coupon: true }
    })

    const activeCoupons = await prisma.coupon.findMany({
      where: { is_active: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      stats: { totalOrders, totalCoupons, aiAssistedOrders },
      recentOrders,
      activeCoupons
    })

  } catch (error) {
    return NextResponse.json({ error: 'Veri çekilemedi' }, { status: 500 })
  }
}
