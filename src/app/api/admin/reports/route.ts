import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const totalOrders = await prisma.order.count()
    
    const revenueAggr = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'cancelled' } }
    })
    
    const totalCustomers = await prisma.customer.count()
    
    const aiAssistedOrders = await prisma.order.count({
      where: { ai_assisted: true }
    })

    const totalRevenue = revenueAggr._sum.totalAmount || 0
    const aiAssistedPercentage = totalOrders > 0 ? Math.round((aiAssistedOrders / totalOrders) * 100) : 0

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      aiAssistedPercentage
    })
  } catch (error) {
    return NextResponse.json({ error: 'Rapor verileri getirilemedi' }, { status: 500 })
  }
}
