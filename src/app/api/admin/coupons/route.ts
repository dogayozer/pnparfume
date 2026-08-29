import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      take: 300,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        _count: { select: { usages: true } }
      }
    })
    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Fetch coupons error:', error)
    return NextResponse.json({ error: 'Kuponlar getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const body = await req.json()
    const { code, discount_type, value, usage_limit, expiresInDays } = body

    if (!code || !discount_type || value === undefined) {
      return NextResponse.json({ error: 'Kod, tür ve değer zorunludur' }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase().replace(/\s+/g, '')
    const existing = await prisma.coupon.findUnique({ where: { code: cleanCode } })
    if (existing) {
      return NextResponse.json({ error: `"${cleanCode}" kodu zaten kullanımda` }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discount_type,
        value: Number(value),
        source: 'manual',
        is_active: true,
        usage_limit: usage_limit ? Number(usage_limit) : null,
        expiresAt: expiresInDays ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000) : null
      }
    })

    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    console.error('Create coupon error:', error)
    return NextResponse.json({ error: error.message || 'Kupon oluşturulamadı' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const { id, is_active } = await req.json()
    if (!id) return NextResponse.json({ error: 'Kupon ID gereklidir' }, { status: 400 })

    const updated = await prisma.coupon.update({
      where: { id },
      data: { is_active: Boolean(is_active) }
    })
    return NextResponse.json({ success: true, coupon: updated })
  } catch (error: any) {
    console.error('Update coupon error:', error)
    return NextResponse.json({ error: error.message || 'Kupon güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Kupon ID gereklidir' }, { status: 400 })

    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete coupon error:', error)
    return NextResponse.json({ error: error.message || 'Kupon silinemedi (kullanılmış kuponlar silinemeyebilir, pasife alın)' }, { status: 500 })
  }
}
