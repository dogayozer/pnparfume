import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'

export async function POST(request: Request) {
  try {
    const { orderId, newAddress, userId } = await request.json()

    if (!orderId || !newAddress || !userId) {
      return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
    }

    // Aşağıdaki "order.customerId !== userId" kontrolü tek başına yeterli değildi —
    // userId istemciden geldiği için, orderId+userId ikilisini bilen biri yine de
    // geçebiliyordu. Artık userId'nin GERÇEKTEN o oturuma ait olduğu da doğrulanıyor.
    if (!requireCustomer(request, userId)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    if (order.customerId !== userId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    // Yalnızca kargolanmamış veya iptal edilmemiş siparişler güncellenebilir
    if (order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled') {
      return NextResponse.json({ error: 'Bu siparişin durumu adres değişikliğine izin vermiyor' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { customerAddress: newAddress }
    })

    return NextResponse.json({ message: 'Adres güncellendi', order: updatedOrder })
  } catch (error) {
    console.error('Update order address error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
