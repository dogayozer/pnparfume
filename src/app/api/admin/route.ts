import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

// NOT: Bu uç, frontend'de artık HİÇ kullanılmıyor gibi görünüyor (kod tabanında
// çağrıldığı hiçbir yer bulunamadı) ve kaynak kodda düz metin, sabit kodlanmış bir
// şifre ("Pds135596") içeriyordu — requireAdmin ile korumaya aldım ama bu eski
// şifre artık hiçbir işe yaramıyor. Kullanılmıyorsa dosyanın tamamen silinmesi
// önerilir (git geçmişinde o şifre yine de kalır, gerçek bir admin şifresi olarak
// tekrar kullanılmamalı).
export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

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
