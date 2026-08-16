import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        partner_type: true,
        wallet_balance: true,
        earned_samples: true,
        budget_segment: true,
        createdAt: true
      }
    })
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Müşteriler getirilemedi' }, { status: 500 })
  }
}
