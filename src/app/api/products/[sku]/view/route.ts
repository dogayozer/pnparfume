import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// Karekod (QR) / tester kampanyalarının kaç kez tıklandığını ölçmek için —
// ViewTracker bileşeni her ürün sayfası ziyaretinde (istemci tarafında) bu uca
// bir istek atar. Sayfa kendisi 24 saat ISR önbelleğinde olduğu için sayaç
// render'da değil, burada (her gerçek ziyaretçide çalışan) tutuluyor.
export async function POST(req: Request, { params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params
  const decodedSku = decodeURIComponent(sku)

  // Aynı IP'den saniyeler içinde onlarca sahte görüntüleme kaydı açılmasın diye
  // hafif bir sınır — normal bir ziyaretçi bu sınıra asla takılmaz.
  if (!checkRateLimit(getClientIp(req) + ':view:' + decodedSku, 10, 60 * 1000)) {
    return NextResponse.json({ ok: true })
  }

  try {
    await prisma.pageView.create({ data: { sku: decodedSku } })
  } catch (error) {
    console.error('Page view tracking error:', error)
  }

  return NextResponse.json({ ok: true })
}
