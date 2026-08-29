import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { platform, type, percentage, family } = await req.json()

    if (!type || !percentage || isNaN(percentage)) {
      return NextResponse.json({ error: 'Geçersiz parametreler' }, { status: 400 })
    }

    const pct = parseFloat(percentage)
    if (pct <= 0) {
      return NextResponse.json({ error: 'Yüzde oranı 0\'dan büyük olmalıdır' }, { status: 400 })
    }

    // Zam ise pozitif çarpan, indirim ise negatif çarpan mantığı
    const multiplier = type === 'zam' ? (1 + (pct / 100)) : (1 - (pct / 100))

    // "Ürün grubu" (koku ailesi) seçiliyse, önce o aileye ait SKU'ları çekip sadece
    // onların fiyatlarını güncelliyoruz — Prisma'da relation üzerinden filtreli toplu
    // matematik güncellemesi (price = price * x WHERE product.family HAS y) doğrudan
    // desteklenmediği için SKU listesini ayrı bir sorguyla alıp raw SQL'e veriyoruz.
    let affectedSkus: string[] | null = null
    if (family && family !== 'all') {
      const productsInFamily = await prisma.product.findMany({
        where: { fragrance_family: { has: family } },
        select: { sku: true }
      })
      affectedSkus = productsInFamily.map(p => p.sku)
      if (affectedSkus.length === 0) {
        return NextResponse.json({ error: `"${family}" koku ailesinde ürün bulunamadı` }, { status: 400 })
      }
    }

    if (affectedSkus) {
      if (platform === 'all') {
        await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1 WHERE "productId" = ANY($2)`, multiplier, affectedSkus)
      } else {
        await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1 WHERE platform = $2 AND "productId" = ANY($3)`, multiplier, platform, affectedSkus)
      }
    } else if (platform === 'all') {
      await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1`, multiplier)
    } else {
      await prisma.$executeRawUnsafe(`UPDATE "MarketplaceListing" SET price = price * $1, "marketPrice" = "marketPrice" * $1 WHERE platform = $2`, multiplier, platform)
    }

    return NextResponse.json({ success: true, message: `İşlem başarıyla uygulandı.` })
  } catch (error: any) {
    console.error('Bulk price error:', error)
    return NextResponse.json({ error: 'Toplu fiyat güncellemesi sırasında sunucu hatası oluştu' }, { status: 500 })
  }
}
