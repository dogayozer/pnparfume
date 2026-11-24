import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { getHepsijetLabelPdf } from '@/lib/hepsijet'

// Admin: HepsiJET gönderisinin resmi etiketini (10x15 cm) PDF olarak döndürür.
export async function GET(req: Request) {
  if (!requireAdmin(req)) return new NextResponse('Yetkisiz erişim', { status: 401 })
  const id = new URL(req.url).searchParams.get('id')
  const order = id ? await prisma.order.findUnique({ where: { id }, select: { cargoCompany: true, trackingCode: true } }) : null
  if (!order || order.cargoCompany !== 'HepsiJET' || !order.trackingCode) {
    return new NextResponse('Bu sipariş için HepsiJET gönderisi bulunamadı.', { status: 404 })
  }
  try {
    const pdf = await getHepsijetLabelPdf(order.trackingCode)
    return new NextResponse(new Uint8Array(pdf), {
      headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="hepsijet-${order.trackingCode}.pdf"`, 'Cache-Control': 'no-store' },
    })
  } catch (e: any) {
    return new NextResponse(`HepsiJET etiketi alınamadı: ${e.message}`, { status: 502 })
  }
}
