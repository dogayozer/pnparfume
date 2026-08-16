import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stores = await prisma.marketplaceStore.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(stores)
  } catch (error) {
    return NextResponse.json({ error: 'Mağazalar getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, platform, sellerId, apiKey, apiSecret } = body

    if (!name || !platform || !sellerId || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Tüm alanları doldurun' }, { status: 400 })
    }

    const newStore = await prisma.marketplaceStore.create({
      data: {
        name,
        platform,
        sellerId,
        apiKey,
        apiSecret,
        isActive: true
      }
    })

    return NextResponse.json(newStore)
  } catch (error) {
    return NextResponse.json({ error: 'Mağaza eklenirken hata oluştu' }, { status: 500 })
  }
}
