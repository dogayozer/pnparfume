import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gereklidir' }, { status: 400 })
    }

    const user = await prisma.customer.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
