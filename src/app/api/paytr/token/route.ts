import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer, cart, totalAmount, discountApplied, shippingFee, couponCode, friendOrderCode } = body

    const merchant_id = process.env.PAYTR_MERCHANT_ID
    const merchant_key = process.env.PAYTR_MERCHANT_KEY
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error("PayTR credentials missing in .env")
      return NextResponse.json({ error: "Ödeme altyapısı yapılandırma hatası" }, { status: 500 })
    }

    // Generate Order ID
    const merchant_oid = 'PN-' + Date.now() + Math.floor(Math.random() * 1000)
    
    // PayTR expects kuruş (multiply by 100)
    const payment_amount = Math.round(totalAmount * 100) 

    // Save to Database
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: merchant_oid,
        totalAmount: totalAmount,
        discountApplied: discountApplied || 0,
        status: 'pending',
        items: cart,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        combinedWithOrderId: friendOrderCode || null,
        shippingCostDiscount: shippingFee === 0 && !friendOrderCode ? 100 : 0
      }
    })

    const user_ip = req.headers.get('x-forwarded-for') || '1.1.1.1' 
    const email = customer.email
    const user_name = customer.name
    const user_address = customer.address
    const user_phone = customer.phone

    // Format basket for PayTR: Array of [ItemName, ItemPrice (String), ItemQuantity]
    const paytrBasket = cart.map((item: any) => [
      `PN ${item.sku} - ${item.name}`,
      item.price.toString(),
      item.quantity
    ])
    
    const user_basket = Buffer.from(JSON.stringify(paytrBasket)).toString('base64')
    
    const debug_on = 1 // Enable debug mode for initial integration
    const no_installment = 0 // 0 allows installments, 1 disables them
    const max_installment = 12
    const currency = 'TL'
    const test_mode = 0 // 1 for test transactions, 0 for real transactions

    // Create Hash String
    // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    
    // Generate Token
    const paytr_token = crypto.createHmac('sha256', merchant_key + merchant_salt).update(hash_str).digest('base64')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const formData = new URLSearchParams()
    formData.append('merchant_id', merchant_id)
    formData.append('user_ip', user_ip)
    formData.append('merchant_oid', merchant_oid)
    formData.append('email', email)
    formData.append('payment_amount', payment_amount.toString())
    formData.append('paytr_token', paytr_token)
    formData.append('user_basket', user_basket)
    formData.append('debug_on', debug_on.toString())
    formData.append('no_installment', no_installment.toString())
    formData.append('max_installment', max_installment.toString())
    formData.append('user_name', user_name)
    formData.append('user_address', user_address)
    formData.append('user_phone', user_phone)
    formData.append('merchant_ok_url', `${siteUrl}/basarili`)
    formData.append('merchant_fail_url', `${siteUrl}/basarisiz`)
    formData.append('timeout_limit', '30')
    formData.append('currency', currency)
    formData.append('test_mode', test_mode.toString())

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    const resultText = await response.text()
    
    try {
      const result = JSON.parse(resultText)
      if (result.status === 'success') {
        // Update order with the token if needed
        await prisma.order.update({
          where: { orderNumber: merchant_oid },
          data: { paytrToken: result.token }
        })
        
        return NextResponse.json({ token: result.token })
      } else {
        console.error("PayTR Token Error:", result.reason)
        return NextResponse.json({ error: result.reason }, { status: 400 })
      }
    } catch (parseError) {
      console.error("PayTR response parse error:", resultText)
      return NextResponse.json({ error: 'PayTR API Invalid Response' }, { status: 500 })
    }
    
  } catch (err: any) {
    console.error("Checkout token generation error:", err)
    return NextResponse.json({ error: 'Sunucu hatası: ' + err.message + ' | Stack: ' + err.stack }, { status: 500 })
  }
}
