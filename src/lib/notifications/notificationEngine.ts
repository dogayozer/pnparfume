import { prisma } from '@/lib/prisma'

interface SendNotificationOptions {
  phone?: string | null
  email?: string | null
  customerId?: string | null
  orderNumber?: string | null
  type?: 'sms' | 'whatsapp' | 'email'
  triggerReason: 'order_created' | 'order_shipped' | 'order_delivered' | 'cart_abandonment' | 'affiliate_commission' | 'custom'
  message: string
}

// Clean and normalize Turkish mobile numbers for Netgsm / WhatsApp
export function formatTurkishPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '90' + cleaned.substring(1)
  } else if (!cleaned.startsWith('90') && cleaned.length === 10) {
    cleaned = '90' + cleaned
  }
  return cleaned
}

// Core dispatcher function
export async function sendNotification(options: SendNotificationOptions) {
  const { phone, customerId, orderNumber, type = 'sms', triggerReason, message } = options

  const netgsmUser = process.env.NETGSM_USERCODE
  const netgsmPass = process.env.NETGSM_PASSWORD
  const netgsmHeader = process.env.NETGSM_HEADER || 'PN PARFUM'

  let status = 'simulated'
  let providerResponse = 'Simülasyon Modu (Canlı API anahtarı girildiğinde otomatik iletilir)'

  if (phone) {
    const formattedPhone = formatTurkishPhone(phone)

    // If real Netgsm credentials exist, dispatch via Netgsm HTTP POST API
    if (netgsmUser && netgsmPass) {
      try {
        const formData = new URLSearchParams()
        formData.append('usercode', netgsmUser)
        formData.append('password', netgsmPass)
        formData.append('gsmno', formattedPhone)
        formData.append('message', message)
        formData.append('msgheader', netgsmHeader)

        const response = await fetch('https://api.netgsm.com.tr/sms/send/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        })

        const resText = await response.text()
        providerResponse = `Netgsm: ${resText}`
        if (resText.startsWith('00') || resText.startsWith('01') || resText.startsWith('02')) {
          status = 'sent'
        } else {
          status = 'failed'
        }
      } catch (err: any) {
        console.error('Netgsm SMS dispatch error:', err)
        status = 'failed'
        providerResponse = `Hata: ${err.message}`
      }
    }
  }

  // Save log to Database
  try {
    const log = await prisma.notification.create({
      data: {
        phone: phone || null,
        customerId: customerId || null,
        orderNumber: orderNumber || null,
        type: type,
        message_content: message,
        trigger_reason: triggerReason,
        status: status,
        providerResponse: providerResponse,
        sentAt: new Date()
      }
    })
    return { success: true, status, logId: log.id, message }
  } catch (dbErr) {
    console.error('Failed to log notification to database:', dbErr)
    return { success: true, status, message }
  }
}

// 1. Sipariş Alındı Bildirimi
export async function sendOrderCreatedNotification(params: {
  orderNumber: string
  customerName: string
  phone?: string | null
  customerId?: string | null
  totalAmount: number
}) {
  const message = `Sayın ${params.customerName}, ${params.orderNumber} numaralı PN Parfüm siparişiniz başarıyla alındı ve ödemesi onaylandı. Paketiniz özenle hazırlanıyor. Teşekkür ederiz!`
  return sendNotification({
    phone: params.phone,
    customerId: params.customerId,
    orderNumber: params.orderNumber,
    triggerReason: 'order_created',
    type: 'sms',
    message
  })
}

// 2. Sipariş Kargoya Verildi Bildirimi (Kargo Takip Linki ile)
export async function sendOrderShippedNotification(params: {
  orderNumber: string
  customerName: string
  phone?: string | null
  customerId?: string | null
  cargoCompany: string
  trackingCode: string
}) {
  const message = `Sayın ${params.customerName}, ${params.orderNumber} nolu PN Parfüm siparişiniz ${params.cargoCompany} firmasına teslim edildi. Kargo Takip No: ${params.trackingCode}. Takip: https://pnparfume.com/profil`
  return sendNotification({
    phone: params.phone,
    customerId: params.customerId,
    orderNumber: params.orderNumber,
    triggerReason: 'order_shipped',
    type: 'sms',
    message
  })
}

// 3. Sipariş Teslim Edildi & VIP İndirim Bildirimi
export async function sendOrderDeliveredNotification(params: {
  orderNumber: string
  customerName: string
  phone?: string | null
  customerId?: string | null
  vipCouponCode?: string
}) {
  const couponText = params.vipCouponCode ? ` Bir sonraki alışverişinizde geçerli %15 VIP kuponunuz: ${params.vipCouponCode}` : ''
  const message = `Sayın ${params.customerName}, PN Parfüm siparişiniz teslim edildi. İmza kokularımızın keyfini çıkarmanızı dileriz!${couponText}`
  return sendNotification({
    phone: params.phone,
    customerId: params.customerId,
    orderNumber: params.orderNumber,
    triggerReason: 'order_delivered',
    type: 'sms',
    message
  })
}

// 4. Marka Elçisi Komisyon Bildirimi
export async function sendAffiliateCommissionNotification(params: {
  ambassadorName: string
  phone?: string | null
  customerId?: string | null
  earnedAmount: number
  newWalletBalance: number
}) {
  const message = `Tebrikler ${params.ambassadorName}! Referans kodunuzla yeni bir sipariş tamamlandı ve cüzdanınıza ${params.earnedAmount} TL komisyon eklendi. Güncel Bakiyeniz: ${params.newWalletBalance} TL. Detaylar: https://pnparfume.com/profil`
  return sendNotification({
    phone: params.phone,
    customerId: params.customerId,
    triggerReason: 'affiliate_commission',
    type: 'sms',
    message
  })
}

// 5. Terk Edilmiş Sepet Hatırlatıcı (Retention Trigger)
export async function sendAbandonedCartNotification(params: {
  customerName: string
  phone?: string | null
  customerId?: string | null
  couponCode: string
}) {
  const message = `Sayın ${params.customerName}, PN Parfüm sepetinizde unuttuğunuz kokular sizi bekliyor! 24 saat geçerli %15 indirim kuponunuz: ${params.couponCode}. Sepetinizi tamamlamak için: https://pnparfume.com/sepet`
  return sendNotification({
    phone: params.phone,
    customerId: params.customerId,
    triggerReason: 'cart_abandonment',
    type: 'sms',
    message
  })
}
