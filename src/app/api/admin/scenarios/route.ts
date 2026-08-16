import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Bütün senaryo kurallarını getirir
export async function GET() {
  try {
    const scenarios = await prisma.scenarioRule.findMany({
      orderBy: { rule_key: 'asc' }
    })
    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Senaryolar çekilemedi:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Senaryo kuralını günceller
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { rule_key, rule_value } = body

    if (!rule_key || rule_value === undefined) {
      return NextResponse.json({ error: 'Eksik veri' }, { status: 400 })
    }

    const updatedRule = await prisma.scenarioRule.update({
      where: { rule_key },
      data: { rule_value: parseFloat(rule_value) }
    })

    return NextResponse.json({ message: 'Kural başarıyla güncellendi', updatedRule })
  } catch (error) {
    console.error('Senaryo güncellenemedi:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
