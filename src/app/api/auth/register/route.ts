import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { firstName, lastName, email, phone, password, emailConsent, smsConsent } = data

    // Validate inputs
    if (!email || !password || !firstName) {
      return NextResponse.json({ error: 'E-posta, şifre ve ad zorunludur.' }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.customer.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Bu e-posta adresiyle zaten bir hesap mevcut.' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Combine name
    const fullName = lastName ? `${firstName} ${lastName}` : firstName

    // Create user
    const user = await prisma.customer.create({
      data: {
        email,
        name: fullName,
        phone: phone || null,
        password: hashedPassword,
        email_opt_in: emailConsent || false,
        sms_opt_in: smsConsent || false
      }
    })

    // Generate unique coupon code for the user
    // e.g. PN-[First 4 chars of ID uppercase]-[Random 4 digit]
    const randomId = Math.floor(1000 + Math.random() * 9000)
    const codeId = user.id.slice(0, 4).toUpperCase()
    const couponCode = `PN-${codeId}-${randomId}`

    // Save coupon to DB
    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        discount_type: 'percentage',
        value: 15,
        is_ai_generated: false,
        is_active: true,
        usage_limit: 1, // Only one time use
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Üyelik başarıyla oluşturuldu.',
      user: userWithoutPassword,
      coupon: coupon.code
    }, { status: 201 })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
