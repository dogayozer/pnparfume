import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gereklidir' }, { status: 400 })
    }

    let user = await prisma.customer.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            orderItems: true
          }
        },
        referredOrders: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true,
            affiliateEarned: true,
            isCommissionPaid: true,
            createdAt: true
          }
        },
        coupons: {
          where: { is_active: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Generate referral code if user doesn't have one
    if (!user.referral_code) {
      const cleanName = (user.name || 'VIP').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()
      const randNum = Math.floor(100 + Math.random() * 900)
      const generatedCode = `PN-${cleanName}-${randNum}`

      user = await prisma.customer.update({
        where: { id: user.id },
        data: { referral_code: generatedCode },
        include: {
          orders: {
            orderBy: { createdAt: 'desc' },
            include: {
              orderItems: true
            }
          },
          referredOrders: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              status: true,
              affiliateEarned: true,
              isCommissionPaid: true,
              createdAt: true
            }
          },
          coupons: {
            where: { is_active: true }
          }
        }
      })
    }

    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Fetch user error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
