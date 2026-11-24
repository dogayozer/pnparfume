import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { cancelHepsijetOrder, HEPSIJET_IS_TEST } from '@/lib/hepsijet'

// Admin: siparişin HepsiJET gönderisini iptal eder. Başarılıysa kargo firması/takip kodu temizlenir; yeniden gönderilebilir.
export async function POST(req: Request) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const { id } = await req.json()
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order || order.cargoCompany !== 'HepsiJET' || !order.trackingCode) {
      return NextResponse.json({ error: 'Bu sipariş için HepsiJET gönderisi bulunamadı.' }, { status: 404 })
    }
    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json({ error: 'Kargolandı/teslim edildi durumundaki sipariş iptal edilemez.' }, { status: 400 })
    }
    const result = await cancelHepsijetOrder(order.trackingCode)
    if (!result.success) return NextResponse.json({ error: `HepsiJET hatası: ${result.error}` }, { status: 502 })
    await prisma.order.update({ where: { id }, data: { trackingCode: null, cargoCompany: null } })
    return NextResponse.json({ success: true, test: HEPSIJET_IS_TEST })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
