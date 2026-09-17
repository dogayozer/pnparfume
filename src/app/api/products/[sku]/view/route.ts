import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// Karekod (QR) / tester kampanyalarının kaç kez tıklandığını, ve ürün
// sayfasındaki "Trendyol'dan Satın Al" gibi dış bağlantıların kaç kez
// tıklandığını ölçmek için — ViewTracker ve ProductActions bu uca istek atar.
// Sayfa kendisi 24 saat ISR önbelleğinde olduğu için sayaç render'da değil,
// burada (her gerçek etkileşimde çalışan) tutuluyor.
const ALLOWED_TYPES = new Set(['view', 'trendyol_click'])

export async function POST(req: Request, { params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  const decodedSku = decodeURIComponent(sku)

  let type = 'view'
  try {
    const body = await req.json()
    if (body?.type && ALLOWED_TYPES.has(body.type)) type = body.type
  } catch {
    // Body yoksa/parse edilemiyorsa varsayılan "view" olarak devam et.
  }

  // Aynı IP'den saniyeler içinde onlarca sahte kayıt açılmasın diye hafif bir
  // sınır — normal bir ziyaretçi bu sınıra asla takılmaz.
  if (!checkRateLimit(getClientIp(req) + ':' + type + ':' + decodedSku, 10, 60 * 1000)) {
    return NextResponse.json({ ok: true })
  }

  try {
    await prisma.pageView.create({ data: { sku: decodedSku, type } })
  } catch (error) {
    console.error('Page view tracking error:', error)
  }

  return NextResponse.json({ ok: true })
}
