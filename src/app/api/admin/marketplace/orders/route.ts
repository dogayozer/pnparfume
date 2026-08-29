import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const orders = await prisma.marketplaceOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        store: {
          select: { name: true, platform: true }
        }
      },
      take: 100 // Son 100 sipariş
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Pazaryeri siparişleri getirilemedi' }, { status: 500 })
  }
}
