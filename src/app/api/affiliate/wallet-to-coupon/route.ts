import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'

export async function POST(req: Request) {
  try {
    const { userId, amount } = await req.json()

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Geçerli bir tutar giriniz' }, { status: 400 })
    }

    // Bu koruma olmadan, birinin başka bir müşterinin ID'sini bilmesi/tahmin etmesi
    // yeterliydi — onun cüzdan bakiyesini kendi adına kupona çevirebiliyordu
    // (doğrudan finansal dolandırıcılık riski).
    if (!requireCustomer(req, userId)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const user = await prisma.customer.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    if (user.wallet_balance < amount) {
      return NextResponse.json({ error: 'Yetersiz cüzdan bakiyesi' }, { status: 400 })
    }

    // Decrement wallet balance
    await prisma.customer.update({
      where: { id: userId },
      data: {
        wallet_balance: { decrement: amount }
      }
    })

    // Generate unique coupon
    const couponCode = `PN-CUZDAN-${Date.now().toString().slice(-6)}`
    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        discount_type: 'fixed',
        value: amount,
        ownerId: user.id,
        source: 'affiliate_wallet',
        is_active: true,
        usage_limit: 1
      }
    })

    return NextResponse.json({
      success: true,
      message: `${amount} TL tutarındaki hediye kuponunuz başarıyla oluşturuldu!`,
      coupon: coupon.code,
      newBalance: user.wallet_balance - amount
    })
  } catch (error) {
    console.error('Wallet to coupon error:', error)
    return NextResponse.json({ error: 'Kupon oluşturulamadı' }, { status: 500 })
  }
}
