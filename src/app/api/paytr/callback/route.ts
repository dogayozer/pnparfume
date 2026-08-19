import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderCreatedNotification } from '@/lib/notifications/notificationEngine'

export async function POST(req: Request) {
  try {
    // PayTR sends data as application/x-www-form-urlencoded
    const formData = await req.formData()
    
    const merchant_oid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const total_amount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string
    const failed_reason_msg = formData.get('failed_reason_msg') as string

    const merchant_key = process.env.PAYTR_MERCHANT_KEY
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT

    if (!merchant_key || !merchant_salt) {
      console.error("PayTR configuration missing in callback")
      return new NextResponse('OK') 
    }

    // Verify hash
    const hash_str = merchant_oid + merchant_salt + status + total_amount
    const calculated_hash = crypto.createHmac('sha256', merchant_key).update(hash_str + merchant_salt).digest('base64')

    if (hash !== calculated_hash) {
      console.error(`PayTR Callback Hash Mismatch for order ${merchant_oid}`)
      return new NextResponse('OK') 
    }

    // Find order
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: merchant_oid },
      include: { orderItems: true }
    })

    if (!existingOrder) {
      console.error(`Order not found: ${merchant_oid}`)
      return new NextResponse('OK')
    }

    // 🔴 1. IDEMPOTENCY CHECK: If already processed, return OK immediately (Prevent duplicate SMS & Commissions)
    if (existingOrder.status === 'paid' || existingOrder.status === 'shipped' || existingOrder.status === 'delivered') {
      console.log(`Order ${merchant_oid} already paid/processed (Idempotent callback ignore).`)
      return new NextResponse('OK', { status: 200 })
    }

    if (status === 'success') {
      // 🔴 2. ATOMIC STOCK REDUCTION & ORDER STATUS UPDATE IN A TRANSACTION
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { orderNumber: merchant_oid },
          data: { status: 'paid' }
        })

        // Decrement stock for items
        const rawItems = (existingOrder.items as any[]) || []
        for (const item of rawItems) {
          const sku = (item.sku || item.id || '').toString().trim()
          const quantity = Number(item.quantity) || 1

          if (sku) {
            await tx.marketplaceListing.updateMany({
              where: {
                productId: sku,
                stock: { gte: quantity }
              },
              data: {
                stock: { decrement: quantity }
              }
            })
          }
        }
      })

      console.log(`Order ${merchant_oid} marked as paid and stock decremented.`)

      // Trigger Automated SMS / WhatsApp Notification (Only once!)
      try {
        await sendOrderCreatedNotification({
          orderNumber: merchant_oid,
          customerName: existingOrder.customerName || 'Değerli Müşterimiz',
          phone: existingOrder.customerPhone,
          customerId: existingOrder.customerId,
          totalAmount: existingOrder.totalAmount
        })
      } catch (notifErr) {
        console.error('Notification dispatch error in PayTR callback:', notifErr)
      }

    } else {
      await prisma.order.update({
        where: { orderNumber: merchant_oid },
        data: { status: 'failed' }
      })
      console.error(`Order ${merchant_oid} payment failed: ${failed_reason_msg}`)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error("PayTR Callback Error:", err)
    return new NextResponse('OK', { status: 200 })
  }
}
