import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signCustomerToken } from '@/lib/customerAuth'

// Yeni üyenin paylaşacağı KENDİ referans kodunu üretir — benzersizliği garanti
// etmek için birkaç deneme yapar (çok düşük ihtimalli çakışma durumunda).
async function generateUniqueReferralCode(name: string): Promise<string> {
  const base = (name || 'PN').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'PN'
  for (let i = 0; i < 5; i++) {
    const rand = Math.floor(100 + Math.random() * 900)
    const candidate = `PN-${base}${rand}`
    const exists = await prisma.customer.findUnique({ where: { referral_code: candidate } })
    if (!exists) return candidate
  }
  // Son çare: cuid tabanlı, pratikte hiç çakışmayan bir kod
  return `PN-${Date.now().toString(36).toUpperCase()}`
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      firstName, lastName, email, phone, password, emailConsent, smsConsent,
      birthYear, birthDate, profession, referralCode
    } = data

    // Validate inputs
    if (!email || !password || !firstName) {
      return NextResponse.json({ error: 'E-posta, şifre ve ad zorunludur.' }, { status: 400 })
    }

    // Önceden şifre uzunluğu hiç kontrol edilmiyordu, 1 karakterlik şifreyle üye
    // olunabiliyordu.
    if (password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 })
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

    // Girilen referans kodu geçerli bir üyeye (davet edene) ait mi? Kendi kendine
    // referans mümkün değil çünkü yeni üyenin kodu henüz üretilmedi.
    let referrer: { id: string; referral_code: string | null } | null = null
    if (referralCode && typeof referralCode === 'string' && referralCode.trim()) {
      const cleanRef = referralCode.trim().toUpperCase()
      referrer = await prisma.customer.findFirst({
        where: { referral_code: cleanRef },
        select: { id: true, referral_code: true }
      })
    }

    // Her yeni üye artık kayıt anında KENDİ referans kodunu alır — önceden bu
    // kod sadece "Marka Elçisi" başvurusu yapan kullanıcılara üretiliyordu, sıradan
    // müşteriler /profil'deki "Tavsiye Et & Kazan" bağlantısını hiç paylaşamıyordu.
    const ownReferralCode = await generateUniqueReferralCode(firstName)

    // Create user
    const user = await prisma.customer.create({
      data: {
        email,
        name: fullName,
        phone: phone || null,
        password: hashedPassword,
        email_opt_in: emailConsent || false,
        sms_opt_in: smsConsent || false,
        birth_year: birthYear ? Number(birthYear) : null,
        birth_date: birthDate || null,
        profession: profession || null,
        referral_code: ownReferralCode,
        referredByCode: referrer?.referral_code || null,
        lastLogin: new Date()
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

    // Geçerli bir referans koduyla üye olunduysa, hem yeni üyeye hem de onu davet
    // eden üyeye ScenarioRule'da (Senaryo Kuralları) tanımlı sabit TL indirimini
    // veren birer kupon tanımlanır — bu kurallar (REFERRAL_REWARD_NEW/EXISTING)
    // önceden admin panelinde görünüyordu ama hiçbir kod onları okumuyordu.
    // Kayıt işleminin kendisini asla bozmasın diye ayrı bir try/catch'te.
    let referralBonusApplied = false
    if (referrer) {
      try {
        const [newRule, existingRule] = await Promise.all([
          prisma.scenarioRule.findUnique({ where: { rule_key: 'REFERRAL_REWARD_NEW' } }),
          prisma.scenarioRule.findUnique({ where: { rule_key: 'REFERRAL_REWARD_EXISTING' } })
        ])
        const newReward = newRule && newRule.is_active ? newRule.rule_value : 90
        const existingReward = existingRule && existingRule.is_active ? existingRule.rule_value : 200
        const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 gün

        if (newReward > 0) {
          await prisma.coupon.create({
            data: {
              code: `PNREF-${user.id.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
              discount_type: 'fixed',
              value: newReward,
              ownerId: user.id,
              source: 'referral',
              usage_limit: 1,
              expiresAt
            }
          })
        }
        if (existingReward > 0) {
          await prisma.coupon.create({
            data: {
              code: `PNREF-${referrer.id.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
              discount_type: 'fixed',
              value: existingReward,
              ownerId: referrer.id,
              source: 'referral',
              usage_limit: 1,
              expiresAt
            }
          })
        }
        referralBonusApplied = true
      } catch (bonusErr) {
        console.error('Referans bonus kuponu oluşturulamadı (kayıt yine de tamamlandı):', bonusErr)
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Üyelik başarıyla oluşturuldu.',
      user: userWithoutPassword,
      coupon: coupon.code,
      referralBonusApplied,
      token: signCustomerToken(user.id)
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
