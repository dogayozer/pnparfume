import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
