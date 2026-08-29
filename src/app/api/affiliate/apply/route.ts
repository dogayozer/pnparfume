import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'

export async function POST(req: Request) {
  try {
    const { userId, instagramHandle, partnerType } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gereklidir' }, { status: 400 })
    }

    if (!requireCustomer(req, userId)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const user = await prisma.customer.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const selectedType = partnerType === 'b2b_sampler' ? 'b2b_sampler' : 'influencer'

    // Clean name for referral code
    const cleanName = (user.name || 'ELCI').replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase()
    const randNum = Math.floor(100 + Math.random() * 900)
    const referralCode = user.referral_code || `PN-${cleanName}-${randNum}`

    // Update user to ambassador
    const updated = await prisma.customer.update({
      where: { id: userId },
      data: {
        partner_type: selectedType,
        referral_code: referralCode,
        profession: instagramHandle ? `Instagram: @${instagramHandle.replace('@', '')}` : user.profession
      }
    })

    // Also create a 10% discount coupon matching their referral code if not exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: referralCode }
    })

    if (!existingCoupon) {
      await prisma.coupon.create({
        data: {
          code: referralCode,
          discount_type: 'percentage',
          value: 10,
          ownerId: user.id,
          source: 'referral',
          is_active: true
        }
      })
    }

    const { password, ...safeUser } = updated

    return NextResponse.json({
      success: true,
      message: 'Marka Elçisi üyeliğiniz başarıyla aktif edildi!',
      user: safeUser
    })
  } catch (error) {
    console.error('Affiliate apply error:', error)
    return NextResponse.json({ error: 'Başvuru tamamlanamadı' }, { status: 500 })
  }
}
