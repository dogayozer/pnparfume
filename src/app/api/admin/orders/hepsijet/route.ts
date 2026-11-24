import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { sendHepsijetOrder, HEPSIJET_IS_TEST } from '@/lib/hepsijet'
import { splitCityDistrict } from '@/lib/trAddress'

// Admin: siparişi HepsiJET'e STD gönderisi olarak iletir. İl/ilçe adminin onayladığı değerlerle gelir.
// GET ?id= → admin penceresini önyüklemek için adresten tahmini il/ilçe döner.
export async function GET(req: Request) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  const id = new URL(req.url).searchParams.get('id')
  const order = id ? await prisma.order.findUnique({ where: { id }, select: { customerAddress: true } }) : null
  if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })
  return NextResponse.json({ ...splitCityDistrict(order.customerAddress || ''), test: HEPSIJET_IS_TEST })
}

export async function POST(req: Request) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const { id, city, district } = await req.json()
    if (!String(city || '').trim() || !String(district || '').trim()) {
      return NextResponse.json({ error: 'İl ve ilçe zorunludur.' }, { status: 400 })
    }
    const order = await prisma.order.findUnique({ where: { id }, include: { customer: true } })
    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })
    if (order.status === 'pending' || order.status === 'awaiting_transfer' || order.status === 'cancelled') {
      return NextResponse.json({ error: 'Ödemesi alınmamış veya iptal edilmiş sipariş gönderilemez.' }, { status: 400 })
    }
    if (order.cargoCompany === 'HepsiJET' && order.trackingCode) {
      return NextResponse.json({ error: `Bu sipariş zaten HepsiJET'e gönderilmiş (takip no: ${order.trackingCode}).` }, { status: 400 })
    }

    const result = await sendHepsijetOrder({
      orderNumber: order.orderNumber,
      customerName: order.customerName || order.customer?.name || 'Misafir Müşteri',
      customerPhone: order.customerPhone || order.customer?.phone || '',
      customerEmail: order.customerEmail || order.customer?.email,
      shippingCity: String(city).trim(),
      shippingDistrict: String(district).trim(),
      shippingAddress: order.customerAddress || '',
    })
    if (!result.success) return NextResponse.json({ error: `HepsiJET hatası: ${result.error}` }, { status: 502 })

    // Müşteriye "kargoda" SMS'i BURADA gitmez (paket henüz teslim alınmadı); admin durumu "Kargolandı" yapınca mevcut akış gönderir.
    const updated = await prisma.order.update({ where: { id }, data: { cargoCompany: 'HepsiJET', trackingCode: result.trackingNumber } })
    return NextResponse.json({ success: true, test: HEPSIJET_IS_TEST, trackingCode: updated.trackingCode, trackingUrl: result.trackingUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
