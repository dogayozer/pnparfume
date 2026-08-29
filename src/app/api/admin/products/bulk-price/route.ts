import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { platform, type, percentage } = await req.json()
    
    if (!type || !percentage || isNaN(percentage)) {
      return NextResponse.json({ error: 'Geçersiz parametreler' }, { status: 400 })
    }

    const pct = parseFloat(percentage)
    if (pct <= 0) {
      return NextResponse.json({ error: 'Yüzde oranı 0\'dan büyük olmalıdır' }, { status: 400 })
    }

    // Zam ise pozitif çarpan, indirim ise negatif çarpan mantığı
    const multiplier = type === 'zam' ? (1 + (pct / 100)) : (1 - (pct / 100))

    // Tüm ürünleri çekip update etmemiz gerekebilir (Prisma'da doğrudan multiply var)
    // Ancak Prisma'da "price = price * multiplier" updateMany desteklenmiyor (henüz field bazlı matematik tam oturmadı)
    // Bu yüzden kayıtları çekip raw sql veya tek tek yapabiliriz. 
    // Daha güvenlisi `executeRaw` kullanmaktır.

    let query
    if (platform === 'all') {
      query = await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1`, multiplier)
    } else {
      query = await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1 WHERE platform = $2`, multiplier, platform)
    }

    return NextResponse.json({ success: true, message: `İşlem başarıyla uygulandı.` })
  } catch (error: any) {
    console.error('Bulk price error:', error)
    return NextResponse.json({ error: 'Toplu fiyat güncellemesi sırasında sunucu hatası oluştu' }, { status: 500 })
  }
}
