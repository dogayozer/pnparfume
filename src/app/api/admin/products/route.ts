import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

// Sitenin fiyat/görsel/stok için okuduğu ilan (bkz. urun/[sku]/page.tsx, katalog, sepet
// fiyatlaması). Önceden admin formu ayrı bir 'pn_store' ilanına yazıyordu ve site o
// kaydı hiç okumadığı için admin'den yapılan fiyat değişiklikleri sitede görünmüyordu.
const STOREFRONT_PLATFORM = 'trendyol'

// Formda "201.jpg" gibi sadece dosya adı girilirse kasap görsel proxy'sine çevir.
function normalizeImage(image: string): string {
  const v = image.trim()
  if (/^(https?:)?\/\//.test(v) || v.startsWith('/')) return v
  return `/api/kasap-image/${encodeURIComponent(v)}`
}

// NOT: Bu dosyanın GET metodu kasıtlı olarak requireAdmin ile korunmuyor — admin
// paneli dışında /mix/engine ve /mix/discovery-set (herkese açık, müşteri tarafı
// sayfalar) de aktif ürün kataloğunu çekmek için bu uca istek atıyor. Ürün kataloğu
// zaten /katalog sayfasında herkese açık olduğu için burada risk yok; sadece
// POST/PUT/DELETE (ürün oluşturma/düzenleme/silme) admin yetkisi gerektiriyor.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const gender = searchParams.get('gender') || ''
    const status = searchParams.get('status') || ''

    const where: any = {}

    if (search) {
      where.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { original_name: { contains: search, mode: 'insensitive' } },
        { mood_tag: { contains: search, mode: 'insensitive' } },
        { fragrance_family: { has: search } }
      ]
    }

    if (gender && gender !== 'all') {
      where.gender = { equals: gender, mode: 'insensitive' }
    }

    if (status && status !== 'all') {
      where.publish_status = status
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        marketplaceListings: true
      },
      // 300 sınırı 338 aktif ürünün bir kısmını hem admin panelinde hem mix sayfalarında gizliyordu.
      take: 1000
    })

    // Bu uç herkese açık (mix sayfaları kullanıyor) — bayi fiyatı sadece admin'e dönmeli.
    if (!requireAdmin(req)) {
      return NextResponse.json(products.map(({ dealer_price, ...rest }) => rest))
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Fetch admin products error:', error)
    return NextResponse.json({ error: 'Ürünler getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const body = await req.json()
    const {
      sku,
      original_name,
      gender = 'Unisex',
      fragrance_family = ['Odunsu'],
      top_notes = 'Bergamot, Narenciye',
      heart_notes = 'Gül, Baharat',
      base_notes = 'Sedir Ağacı, Amber',
      mood_tag = 'Karizmatik & Çekici',
      persona_tag = 'Modern Şehirli',
      status_tag = 'İmza Parfüm',
      bottle_aesthetic_tag = 'Minimalist Lüks',
      season_tag = 'Dört Mevsim',
      time_of_day_tag = 'Gündüz & Gece',
      occasion_tag = 'Özel Davet & Günlük',
      longevity_score = 9,
      sillage_score = 8,
      gift_safe_score = 9,
      age_focus = '20-50',
      content_tag = 'Konsantre Esans (Extrait de Parfum)',
      base_cost = 250,
      price = 850,
      stock = 50,
      publish_status = 'ACTIVE',
      image
    } = body

    if (!sku || !original_name) {
      return NextResponse.json({ error: 'SKU kodu ve Parfüm adı zorunludur' }, { status: 400 })
    }

    const cleanSku = sku.trim().replace(/^PN\s*/i, '').toUpperCase()

    // Check if exists
    const existing = await prisma.product.findUnique({
      where: { sku: cleanSku }
    })

    if (existing) {
      return NextResponse.json({ error: `PN ${cleanSku} SKU koduna sahip bir ürün zaten mevcut!` }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sku: cleanSku,
        original_name: original_name.trim(),
        seo_name: original_name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        publish_status,
        gender,
        fragrance_family: Array.isArray(fragrance_family) ? fragrance_family : [fragrance_family],
        top_notes,
        heart_notes,
        base_notes,
        mood_tag,
        persona_tag,
        status_tag,
        bottle_aesthetic_tag,
        season_tag,
        time_of_day_tag,
        occasion_tag,
        longevity_score: Number(longevity_score) || 8,
        sillage_score: Number(sillage_score) || 8,
        gift_safe_score: Number(gift_safe_score) || 8,
        age_focus,
        content_tag,
        base_cost: Number(base_cost) || 0,
        marketplaceListings: {
          create: {
            platform: STOREFRONT_PLATFORM,
            price: Number(price) || 850,
            stock: Number(stock) || 50,
            images: image ? [normalizeImage(image)] : []
          }
        }
      },
      include: {
        marketplaceListings: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `PN ${cleanSku} parfümü başarıyla oluşturuldu!`,
      product
    })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: error.message || 'Ürün oluşturulamadı' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const body = await req.json()
    const {
      sku,
      original_name,
      gender,
      fragrance_family,
      top_notes,
      heart_notes,
      base_notes,
      mood_tag,
      persona_tag,
      season_tag,
      occasion_tag,
      longevity_score,
      sillage_score,
      publish_status,
      base_cost,
      price,
      stock,
      image,
      is_featured,
      is_on_sale,
      dealer_price
    } = body

    if (!sku) {
      return NextResponse.json({ error: 'SKU kodu gereklidir' }, { status: 400 })
    }

    const cleanSku = sku.trim().replace(/^PN\s*/i, '').toUpperCase()

    // "Çok Satanlar" / "İndirimde" vitrinleri en fazla 10 ürünle sınırlı — sunucu
    // tarafında da doğrulanıyor (frontend'deki sayaç tek başına yeterli değil).
    if (is_featured === true) {
      const count = await prisma.product.count({ where: { is_featured: true, sku: { not: cleanSku } } })
      if (count >= 10) {
        return NextResponse.json({ error: '"Çok Satanlar" vitrini zaten 10 ürünle dolu. Önce birini çıkarın.' }, { status: 400 })
      }
    }
    if (is_on_sale === true) {
      const count = await prisma.product.count({ where: { is_on_sale: true, sku: { not: cleanSku } } })
      if (count >= 10) {
        return NextResponse.json({ error: '"İndirimde" vitrini zaten 10 ürünle dolu. Önce birini çıkarın.' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (is_featured !== undefined) updateData.is_featured = is_featured
    if (is_on_sale !== undefined) updateData.is_on_sale = is_on_sale
    if (original_name !== undefined) updateData.original_name = original_name.trim()
    if (gender !== undefined) updateData.gender = gender
    if (fragrance_family !== undefined) updateData.fragrance_family = Array.isArray(fragrance_family) ? fragrance_family : [fragrance_family]
    if (top_notes !== undefined) updateData.top_notes = top_notes
    if (heart_notes !== undefined) updateData.heart_notes = heart_notes
    if (base_notes !== undefined) updateData.base_notes = base_notes
    if (mood_tag !== undefined) updateData.mood_tag = mood_tag
    if (persona_tag !== undefined) updateData.persona_tag = persona_tag
    if (season_tag !== undefined) updateData.season_tag = season_tag
    if (occasion_tag !== undefined) updateData.occasion_tag = occasion_tag
    if (longevity_score !== undefined) updateData.longevity_score = Number(longevity_score)
    if (sillage_score !== undefined) updateData.sillage_score = Number(sillage_score)
    if (publish_status !== undefined) updateData.publish_status = publish_status
    if (base_cost !== undefined) updateData.base_cost = Number(base_cost)
    // null/boş/0 → ürüne özel bayi fiyatı kaldırılır, varsayılan iskonto uygulanır.
    if (dealer_price !== undefined) updateData.dealer_price = Number(dealer_price) > 0 ? Number(dealer_price) : null

    const updated = await prisma.product.update({
      where: { sku: cleanSku },
      data: updateData,
      include: {
        marketplaceListings: true
      }
    })

    // Update or create store listing for price and stock
    if (price !== undefined || stock !== undefined || image !== undefined) {
      const current = await prisma.marketplaceListing.findUnique({
        where: { productId_platform: { productId: cleanSku, platform: STOREFRONT_PLATFORM } },
        select: { images: true }
      })
      // Formda tek görsel alanı var: sadece ana (ilk) görseli değiştir, galerinin
      // geri kalanını koru — aksi halde her kayıtta ürünün diğer görselleri silinirdi.
      const images = image
        ? [normalizeImage(image), ...(current?.images || []).slice(1)]
        : undefined

      await prisma.marketplaceListing.upsert({
        where: {
          productId_platform: {
            productId: cleanSku,
            platform: STOREFRONT_PLATFORM
          }
        },
        update: {
          price: price !== undefined ? Number(price) : undefined,
          stock: stock !== undefined ? Number(stock) : undefined,
          images
        },
        create: {
          productId: cleanSku,
          platform: STOREFRONT_PLATFORM,
          price: Number(price) || 850,
          stock: Number(stock) || 50,
          images: images || []
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `PN ${cleanSku} parfümü başarıyla güncellendi!`,
      product: updated
    })
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: error.message || 'Ürün güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const sku = searchParams.get('sku')

    if (!sku) {
      return NextResponse.json({ error: 'SKU kodu gereklidir' }, { status: 400 })
    }

    const cleanSku = sku.trim().replace(/^PN\s*/i, '').toUpperCase()

    await prisma.product.delete({
      where: { sku: cleanSku }
    })

    return NextResponse.json({
      success: true,
      message: `PN ${cleanSku} ürünü başarıyla silindi.`
    })
  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: error.message || 'Ürün silinemedi' }, { status: 500 })
  }
}
