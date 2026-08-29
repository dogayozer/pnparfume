import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'all', 'pending', 'approved'

    const where: any = {}
    if (status === 'pending') {
      where.isApproved = false
    } else if (status === 'approved') {
      where.isApproved = true
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        product: {
          select: { sku: true, original_name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Admin reviews fetch error:', error)
    return NextResponse.json({ error: 'Yorumlar yüklenemedi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { reviewId, isApproved } = await req.json()

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID gereklidir' }, { status: 400 })
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: Boolean(isApproved) }
    })

    return NextResponse.json({
      success: true,
      message: isApproved ? 'Yorum onaylandı ve yayına alındı' : 'Yorum yayından kaldırıldı',
      review: updated
    })
  } catch (error) {
    console.error('Admin review update error:', error)
    return NextResponse.json({ error: 'Yorum güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Review ID gereklidir' }, { status: 400 })
    }

    await prisma.review.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Yorum silindi' })
  } catch (error) {
    console.error('Admin review delete error:', error)
    return NextResponse.json({ error: 'Yorum silinemedi' }, { status: 500 })
  }
}
