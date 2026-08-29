import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAdminToken, requireAdmin } from '@/lib/adminAuth'

// In-memory rate limiting map: IP -> { attempts: number, resetAt: number }
const loginAttempts = new Map<string, { attempts: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { attempts: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }

  if (record.attempts >= 5) {
    return false
  }

  record.attempts += 1
  return true
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip)
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip'

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ 
        error: 'Çok fazla hatalı giriş denemesi yapıldı. Güvenliğiniz için hesabınız 15 dakika kilitlendi.' 
      }, { status: 429 })
    }

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gereklidir' }, { status: 400 })
    }

    // Check if any admin exists, if not seed default admin
    let admin = await prisma.adminUser.findFirst({
      where: { username }
    })

    if (!admin) {
      const totalAdmins = await prisma.adminUser.count()
      if (totalAdmins === 0 && username === 'admin') {
        const hashedPassword = await bcrypt.hash('pn2026!', 10)
        admin = await prisma.adminUser.create({
          data: {
            username: 'admin',
            password: hashedPassword,
            name: 'PN Yönetici'
          }
        })
      } else {
        return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
      }
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
    }

    // Reset rate limit on successful login
    resetRateLimit(ip)

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      },
      // Önceden burada imzasız, hiçbir yerde doğrulanmayan rastgele bir string
      // dönüyordu — tüm admin API'leri fiilen korumasızdı. Artık HMAC ile imzalanmış,
      // requireAdmin() ile her admin isteğinde gerçekten doğrulanan bir token dönüyor.
      token: signAdminToken(admin.id)
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Sunucu hatası oluştu' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    // Önceden bu endpoint'te (POST /api/admin/auth'un aksine) ne oturum kontrolü ne
    // de deneme sınırı vardı — biri hiç giriş yapmadan doğrudan buraya istek atıp
    // currentPassword'ü sınırsız deneyerek admin şifresini bulmaya çalışabilirdi.
    const admin_ = requireAdmin(req)
    if (!admin_) {
      return NextResponse.json({ error: 'Yetkisiz erişim — lütfen tekrar giriş yapın' }, { status: 401 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        error: 'Çok fazla hatalı deneme yapıldı. Güvenliğiniz için 15 dakika bekleyin.'
      }, { status: 429 })
    }

    const { currentPassword, newUsername, newPassword, newName } = await req.json()

    if (!currentPassword) {
      return NextResponse.json({ error: 'Mevcut şifrenizi girmelisiniz' }, { status: 400 })
    }

    // Get primary admin
    let admin = await prisma.adminUser.findFirst()

    if (!admin) {
      // Create with default first
      const hashedPassword = await bcrypt.hash('pn2026!', 10)
      admin = await prisma.adminUser.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          name: 'PN Yönetici'
        }
      })
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Mevcut şifreniz hatalı' }, { status: 401 })
    }

    resetRateLimit(ip)

    const updateData: any = {}
    if (newUsername && newUsername.trim()) updateData.username = newUsername.trim()
    if (newName && newName.trim()) updateData.name = newName.trim()
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır' }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10)
    }

    const updated = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Yönetici hesap bilgileri başarıyla güncellendi',
      user: {
        id: updated.id,
        username: updated.username,
        name: updated.name
      }
    })
  } catch (error) {
    console.error('Admin update error:', error)
    return NextResponse.json({ error: 'Hesap bilgileri güncellenemedi' }, { status: 500 })
  }
}
