import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ error: 'Kupon kodu giriniz' }, { status: 400 })

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon || !coupon.is_active) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş kupon' }, { status: 400 })
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ error: 'Bu kupon limitine ulaşmış' }, { status: 400 })
    }

    return NextResponse.json({ value: coupon.value, type: coupon.discount_type })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
