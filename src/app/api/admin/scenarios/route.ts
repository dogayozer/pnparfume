import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

const DEFAULT_RULES = [
  { rule_key: 'FREE_SHIPPING_LIMIT', rule_value: 500, description: 'Ücretsiz Kargo Barajı (TL)' },
  { rule_key: 'SHIPPING_COST', rule_value: 100, description: 'Standart Kargo Ücreti (TL)' },
  { rule_key: 'AFFILIATE_COMMISSION_RATE', rule_value: 15, description: 'Marka Elçisi Komisyon Oranı (%)' },
  { rule_key: 'SECOND_ITEM_DISCOUNT', rule_value: 250, description: '2. Ürün Sepet İndirimi (TL)' },
  { rule_key: 'VIP_COUPON_PERCENT', rule_value: 15, description: 'Sipariş Teslimat VIP İndirim Kuponu (%)' },
  { rule_key: 'MIN_PROFIT_MARGIN_PERCENT', rule_value: 0, description: 'Kupon Sonrası Minimum Kâr Marjı (%) — 0 = sepet toplamı maliyetin altına düşemez' },

  // --- Kârlılık Simülatörü girdileri (admin panelinde ayrı bir sekmede,
  // hesap makinesi arayüzüyle düzenleniyor — aşağıdaki değerler sadece
  // örnek/placeholder, gerçek maliyetler girilene kadar kullanılmamalı) ---
  { rule_key: 'USD_TRY_KURU', rule_value: 40, description: 'Kârlılık Simülatörü: USD/TRY Kuru (örnek değer, güncelleyin)' },
  { rule_key: 'BOTTLE_COST_USD', rule_value: 3, description: 'Kârlılık Simülatörü: Şişe Maliyeti (USD, örnek değer)' },
  { rule_key: 'BOX_COST_USD', rule_value: 1, description: 'Kârlılık Simülatörü: Kutu Maliyeti (USD, örnek değer)' },
  { rule_key: 'OTHER_PRODUCT_COST_TRY', rule_value: 20, description: 'Kârlılık Simülatörü: Esans/Diğer Ürün Maliyeti (TL, örnek değer)' },
  { rule_key: 'SIM_SHIPPING_COST_TRY', rule_value: 130, description: 'Kârlılık Simülatörü: İşletmenin Taşıyıcıya Ödediği Gerçek Kargo Maliyeti (TL) — müşteriden alınan SHIPPING_COST ücretinden bilerek ayrı' },
  { rule_key: 'AVG_SALE_PRICE_TRY', rule_value: 600, description: 'Kârlılık Simülatörü: Ortalama Satış Fiyatı (TL)' },
  { rule_key: 'DAILY_NEW_MEMBERS', rule_value: 10, description: 'Kârlılık Simülatörü: Günlük Yeni Üye Sayısı (varsayım)' },
  { rule_key: 'REFERRAL_RATE_PERCENT', rule_value: 15, description: 'Kârlılık Simülatörü: Tavsiye Eden Üye Oranı (%, varsayım)' },
  { rule_key: 'ELCI_DAILY_ORDERS', rule_value: 3, description: 'Kârlılık Simülatörü: Elçi/Influencer Kaynaklı Günlük Sipariş Sayısı (varsayım, süregelen komisyonlu kanal)' },
  { rule_key: 'AVG_REFERRALS_PER_MEMBER', rule_value: 1.5, description: 'Kârlılık Simülatörü: Üye Başına Ortalama Tavsiye Sayısı (varsayım)' },
  { rule_key: 'REFERRAL_CONVERSION_PERCENT', rule_value: 35, description: 'Kârlılık Simülatörü: Tavsiyenin Siparişe Dönüşme Oranı (%, varsayım)' }
]

// Bütün senaryo kurallarını getirir
export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    let scenarios = await prisma.scenarioRule.findMany({
      orderBy: { rule_key: 'asc' }
    })

    // Eksik varsayılan kuralları tamamla. NOT: tablodaki toplam satır sayısını
    // DEFAULT_RULES.length ile karşılaştırmak yanlıştı — tabloda bu projede daha
    // önce (Antigravity tarafından) eklenmiş, DEFAULT_RULES'ta hiç yer almayan
    // başka anahtarlar da var (AFFILIATE_COMMISSION_PCT, REFERRAL_REWARD_* vb.),
    // o yüzden sayılar tesadüfen eşitse eksik anahtar hiç fark edilmiyordu. Bunun
    // yerine mevcut anahtarları tek tek kontrol edip sadece GERÇEKTEN eksik olanı
    // oluşturuyoruz — var olan hiçbir kaydın değerine dokunulmuyor.
    const existingKeys = new Set(scenarios.map(r => r.rule_key))
    const missingRules = DEFAULT_RULES.filter(r => !existingKeys.has(r.rule_key))
    if (missingRules.length > 0) {
      for (const r of missingRules) {
        await prisma.scenarioRule.upsert({
          where: { rule_key: r.rule_key },
          update: {},
          create: r
        })
      }
      scenarios = await prisma.scenarioRule.findMany({ orderBy: { rule_key: 'asc' } })
    }

    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Senaryolar çekilemedi:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Senaryo kuralını günceller
export async function PUT(request: Request) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    const body = await request.json()
    const { rule_key, rule_value } = body

    if (!rule_key || rule_value === undefined) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 })
    }

    const updatedRule = await prisma.scenarioRule.upsert({
      where: { rule_key },
      update: { rule_value: parseFloat(rule_value) },
      create: { rule_key, rule_value: parseFloat(rule_value), description: rule_key }
    })

    return NextResponse.json({ message: 'Kural başarıyla güncellendi', updatedRule })
  } catch (error) {
    console.error('Senaryo güncellenemedi:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
