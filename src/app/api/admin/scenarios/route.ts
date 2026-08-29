import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

const DEFAULT_RULES = [
  { rule_key: 'FREE_SHIPPING_LIMIT', rule_value: 500, description: 'Ücretsiz Kargo Barajı (TL)' },
  { rule_key: 'AFFILIATE_COMMISSION_RATE', rule_value: 15, description: 'Marka Elçisi Komisyon Oranı (%)' },
  { rule_key: 'SECOND_ITEM_DISCOUNT', rule_value: 250, description: '2. Ürün Sepet İndirimi (TL)' },
  { rule_key: 'VIP_COUPON_PERCENT', rule_value: 15, description: 'Sipariş Teslimat VIP İndirim Kuponu (%)' }
]

// Bütün senaryo kurallarını getirir
export async function GET(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

    let scenarios = await prisma.scenarioRule.findMany({
      orderBy: { rule_key: 'asc' }
    })

    // Seed defaults if empty
    if (scenarios.length === 0) {
      for (const r of DEFAULT_RULES) {
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
