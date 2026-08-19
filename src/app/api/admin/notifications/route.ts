import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNotification } from '@/lib/notifications/notificationEngine'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, phone: true }
        }
      },
      take: 100
    })
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Fetch notifications error:', error)
    return NextResponse.json({ error: 'Bildirimler getirilemedi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { phone, message, type = 'sms' } = await req.json()

    if (!phone || !message) {
      return NextResponse.json({ error: 'Telefon ve mesaj alanları zorunludur' }, { status: 400 })
    }

    const result = await sendNotification({
      phone,
      type: type,
      triggerReason: 'custom',
      message
    })

    return NextResponse.json({
      success: true,
      message: 'Bildirim başarıyla kuyruğa alındı',
      result
    })
  } catch (error) {
    console.error('Send notification error:', error)
    return NextResponse.json({ error: 'Bildirim gönderilemedi' }, { status: 500 })
  }
}
