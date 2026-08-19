import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
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

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Giriş başarılı.',
      user: userWithoutPassword
    }, { status: 200 })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
