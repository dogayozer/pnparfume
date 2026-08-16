import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { items, couponCode, totalAmount, discount } = await req.json()
    
    // Basit bir orderNumber olusturalim
    const orderNumber = 'PN-' + Date.now().toString().slice(-6)

    let couponId = null
    let isAiAssisted = false

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
      if (coupon && coupon.is_active) {
        couponId = coupon.id
        isAiAssisted = coupon.is_ai_generated
        
        // Increase usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usage_count: { increment: 1 } }
        })
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        discountApplied: discount,
        ai_assisted: isAiAssisted,
        couponId,
        status: 'paid' // Varsayalim odendi
      }
    })

    return NextResponse.json({ success: true, orderNumber })
  } catch (error) {
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
  }
}
