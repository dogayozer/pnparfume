import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sku = searchParams.get('sku')

    const where: any = { isApproved: true }
    if (sku) {
      where.productSku = sku
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const totalCount = await prisma.review.count({ where })
    const avgRatingResult = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

    return NextResponse.json({
      reviews,
      totalCount,
      averageRating: parseFloat(avgRatingResult)
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Yorumlar getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { productSku, customerName, rating, comment, customerId, images } = await req.json()

    if (!productSku || !customerName || !rating || !comment) {
      return NextResponse.json({ error: 'Lütfen tüm zorunlu alanları doldurun' }, { status: 400 })
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5))

    const newReview = await prisma.review.create({
      data: {
        productSku,
        customerName: customerName.trim(),
        customerId: customerId || null,
        rating: numericRating,
        comment: comment.trim(),
        images: Array.isArray(images) ? images : [],
        isApproved: false // Admin onayı bekler
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Değerlendirmeniz için teşekkür ederiz! Yorumunuz incelendikten sonra yayınlanacaktır.',
      review: newReview
    })
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json({ error: 'Yorum kaydedilemedi' }, { status: 500 })
  }
}
