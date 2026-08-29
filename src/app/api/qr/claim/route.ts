import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification, formatTurkishPhone } from '@/lib/notifications/notificationEngine'

export const maxDuration = 15

// Ürün kutusundaki QR kod bu uca düşer (bkz. /hosgeldin sayfası). Amaç: müşteri
// üyelik formuyla hiç uğraşmadan (tek alan: telefon), anında gerçek bir indirim
// kodu görsün ve aynı kod SMS ile de telefonuna gitsin — sürtünmeyi en aza indirip
// "meraktan aksiyona" anını yakalıyoruz. Tam üyelik (isim/şifre) sonraki adımda,
// isteğe bağlı, kod zaten cebindeyken teklif ediliyor (progressive profiling).

// IP bazlı basit deneme sınırı — aynı IP'den saniyeler içinde onlarca kupon
// üretilmesini engeller. (Aynı telefonun tekrar tekrar kod alması engellenmiyor;
// bu, yeni bir Lead/Customer tablosu gerektirir ve ilk sürüm kapsamı dışında —
// kabul edilebilir bir risk, SMS maliyeti düşük ve kodlar tek kullanımlık.)
const attempts = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 60 * 1000 })
    return true
  }
  if (record.count >= 5) return false
  record.count += 1
  return true
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.' }, { status: 429 })
    }

    const { phone } = await req.json()
    if (!phone || phone.replace(/[^0-9]/g, '').length < 10) {
      return NextResponse.json({ error: 'Geçerli bir telefon numarası girin.' }, { status: 400 })
    }

    const formattedPhone = formatTurkishPhone(phone)
    const code = 'PNQR' + Math.random().toString(36).substring(2, 7).toUpperCase()

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discount_type: 'percentage',
        value: 20,
        source: 'qr_welcome',
        is_active: true,
        usage_limit: 1,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 saat
      }
    })

    // Kodu SMS ile de gönder — hem güven verir (gerçek olduğunu kanıtlar) hem de
    // müşteri sayfadan ayrılsa/kapatsa bile kod kaybolmaz.
    try {
      await sendNotification({
        phone: formattedPhone,
        type: 'sms',
        triggerReason: 'qr_scan_welcome',
        message: `PN Parfüm'e hoş geldin! İlk siparişine özel %20 indirim kodun: ${code} (48 saat geçerli). pnparfume.com`
      })
    } catch (e) {
      console.error('QR welcome SMS error:', e)
      // SMS başarısız olsa bile kod sayfada zaten gösterildiği için akışı bozmuyoruz.
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercentage: coupon.value,
      expiresAt: coupon.expiresAt
    })
  } catch (error) {
    console.error('QR claim error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' }, { status: 500 })
  }
}
