import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signCustomerToken } from '@/lib/customerAuth'

// Basit IP bazlı deneme sınırı — önceden hiç yoktu, şifre brute-force denemesine açıktı.
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { attempts: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (record.attempts >= 10) return false
  record.attempts += 1
  return true
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown-ip'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Çok fazla hatalı deneme yapıldı. Lütfen 15 dakika sonra tekrar deneyin.' }, { status: 429 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-posta ve şifre zorunludur.' }, { status: 400 })
    }

    const user = await prisma.customer.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.' }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Hatalı şifre.' }, { status: 401 })
    }

    // Update last login timestamp
    await prisma.customer.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Giriş başarılı.',
      user: userWithoutPassword,
      // Bu token'sız daha önce /api/user/* uçları herhangi bir userId'ye körü körüne
      // güveniyordu (herkes başka bir müşterinin verisini görebiliyordu). Artık bu
      // imzalı token'ı Authorization header'ında göndermeyen/kendine ait olmayan bir
      // userId ile eşleşmeyen istekler reddediliyor.
      token: signCustomerToken(user.id)
    }, { status: 200 })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
