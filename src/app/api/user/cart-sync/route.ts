import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId, cart } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 })
    }

    await prisma.customer.update({
      where: { id: userId },
      data: { cart: cart || [] }
    })

    return NextResponse.json({ message: 'Sepet senkronize edildi' })
  } catch (error) {
    return NextResponse.json({ error: 'Sepet güncellenemedi' }, { status: 500 })
  }
}
