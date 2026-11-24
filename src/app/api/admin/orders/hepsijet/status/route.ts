import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { getHepsijetTracking, HEPSIJET_IS_TEST } from '@/lib/hepsijet'

// Admin: HepsiJET gönderisinin son durumunu sorgular (salt okunur; sipariş durumunu DEĞİŞTİRMEZ).
// Sipariş durumunu admin mevcut akıştan (Kargolandı / Teslim Edildi) kendisi günceller.
export async function POST(req: Request) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const { id } = await req.json()
    const order = await prisma.order.findUnique({ where: { id }, select: { cargoCompany: true, trackingCode: true } })
    if (!order || order.cargoCompany !== 'HepsiJET' || !order.trackingCode) {
      return NextResponse.json({ error: 'Bu sipariş için HepsiJET gönderisi bulunamadı.' }, { status: 404 })
    }
    const t = await getHepsijetTracking(order.trackingCode)
    if (!t) return NextResponse.json({ error: 'HepsiJET bu barkod için durum döndürmedi.' }, { status: 502 })
    const label = t.deliveryStatus === 'DELIVERED' ? 'Teslim edildi' : t.moved ? 'Kurye teslim aldı / yolda' : 'Henüz kurye teslim almadı'
    return NextResponse.json({ success: true, test: HEPSIJET_IS_TEST, label, deliveryStatus: t.deliveryStatus, lastTransaction: t.lastTransaction })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
