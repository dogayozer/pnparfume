import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { products } = await req.json()
    
    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 })
    }

    // Gelen ürünleri upsert mantığıyla güncelleveya oluştur
    // Products dizisi içinde { sku, original_name, gender, publish_status, base_cost, vs. } olabilir
    
    let successCount = 0
    let errorCount = 0

    // Veritabanını yormamak ve deadlock yememek için transaction içinde veya sıralı çalıştırabiliriz
    for (const item of products) {
      if (!item.sku || !item.original_name) {
        errorCount++
        continue
      }
      
      try {
        await prisma.product.upsert({
          where: { sku: item.sku },
          update: {
            original_name: item.original_name,
            gender: item.gender || 'Unisex',
            base_cost: item.base_cost ? parseFloat(item.base_cost) : undefined,
            publish_status: item.publish_status || 'ACTIVE',
            // Ek alanlar excelden geliyorsa buraya eklenebilir
          },
          create: {
            sku: item.sku,
            original_name: item.original_name,
            gender: item.gender || 'Unisex',
            mood_tag: item.mood_tag || 'Bilinmiyor',
            persona_tag: item.persona_tag || 'Bilinmiyor',
            status_tag: item.status_tag || 'Bilinmiyor',
            bottle_aesthetic_tag: item.bottle_aesthetic_tag || 'Bilinmiyor',
            season_tag: item.season_tag || 'Dört Mevsim',
            time_of_day_tag: item.time_of_day_tag || 'Gündüz',
            occasion_tag: item.occasion_tag || 'Günlük',
            longevity_score: item.longevity_score ? parseInt(item.longevity_score) : 5,
            sillage_score: item.sillage_score ? parseInt(item.sillage_score) : 5,
            gift_safe_score: item.gift_safe_score ? parseInt(item.gift_safe_score) : 5,
            age_focus: item.age_focus || 'Tüm Yaşlar',
            content_tag: item.content_tag || 'Standart',
            base_cost: item.base_cost ? parseFloat(item.base_cost) : 0,
          }
        })
        successCount++
      } catch (e) {
        console.error(`Error updating product ${item.sku}:`, e)
        errorCount++
      }
    }

    return NextResponse.json({ success: true, processed: products.length, successCount, errorCount })
  } catch (error: any) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'İçe aktarma sırasında sunucu hatası oluştu', details: error.message }, { status: 500 })
  }
}
