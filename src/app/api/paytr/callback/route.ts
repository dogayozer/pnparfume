import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const calculated_hash = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64')

    if (hash !== calculated_hash) {
      console.error(`PayTR Callback Hash Mismatch for order ${merchant_oid}`)
      return new NextResponse('OK') 
    }

    if (status === 'success') {
      await prisma.order.update({
        where: { orderNumber: merchant_oid },
        data: { status: 'paid' }
      })
      console.log(`Order ${merchant_oid} paid successfully via PayTR.`)
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
