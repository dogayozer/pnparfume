import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'
import { priceCart, computeTotals } from '@/lib/checkoutPricing'
import { getIntegrationSettings } from '@/lib/integrationSettings'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { notifyN8n } from '@/lib/n8n'

// Yurt dışı adresli siparişler: kart ödemesi (PayTR) yerine havale/EFT. Kargo ücreti
// talep üzerine belirlenir ve müşteriye e-postayla bildirilir; bu yüzden toplam tutar
// kargosuzdur. Fiyatlar PayTR akışındaki gibi sunucuda yeniden hesaplanır. Kupon kullanımı
// bu akışta desteklenmez (kupon tüketimi ödeme onayına bağlı olduğundan).

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')
const clean = (v: unknown, max = 300) => String(v ?? '').trim().slice(0, max)

const TR_NAMES = ['türkiye', 'turkiye', 'turkey', 'tr', 'türkei', 'turquie']

const MAIL = {
  tr: {
    subject: 'Siparişiniz alındı (havale ile ödeme)',
    body: (no: string) =>
      `<p>Siparişiniz (${no}) alındı. Teşekkür ederiz.</p><p>Yurt dışı gönderilerde ödeme havale/EFT ile yapılır ve kargo ücreti talebiniz üzerine belirlenir. Ekibimiz kargo ücretini ve ödeme bilgilerini içeren bir e-postayı en kısa sürede size iletecektir.</p><p>PN Parfüm / pnparfume.com</p>`,
  },
  en: {
    subject: 'We have received your order (bank transfer payment)',
    body: (no: string) =>
      `<p>We have received your order (${no}). Thank you.</p><p>For shipments abroad, payment is made by bank transfer and the shipping cost is determined on request. Our team will email you the shipping cost and payment details as soon as possible.</p><p>PN Parfüm / pnparfume.com</p>`,
  },
  ar: {
    subject: 'تم استلام طلبك (الدفع بالتحويل البنكي)',
    body: (no: string) =>
      `<p dir="rtl">تم استلام طلبك (${no}). شكرًا لك.</p><p dir="rtl">في الشحنات الدولية يتم الدفع بالتحويل البنكي، وتُحدَّد تكلفة الشحن بناءً على طلبك. سيرسل لك فريقنا بريدًا إلكترونيًا يتضمن تكلفة الشحن وتفاصيل الدفع في أقرب وقت.</p><p dir="rtl">PN Parfüm / pnparfume.com</p>`,
  },
} as const

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(`intl-order:${getClientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests / Çok fazla deneme.' }, { status: 429 })
    }

    const body = await req.json()
    if (body.website2) return NextResponse.json({ success: true })

    const c = body.customer || {}
    const customer = {
      name: clean(c.name, 150),
      email: clean(c.email, 150),
      phone: clean(c.phone, 40),
      address: clean(c.address, 600),
      country: clean(c.country, 80),
    }
    const locale: 'tr' | 'en' | 'ar' = ['tr', 'en', 'ar'].includes(body.locale) ? body.locale : 'en'

    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.country) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (TR_NAMES.includes(customer.country.toLocaleLowerCase('tr-TR'))) {
      return NextResponse.json({ error: 'Orders within Türkiye are paid by card.' }, { status: 400 })
    }

    const auth = requireCustomer(req)
    const authCustomer = auth
      ? await prisma.customer.findUnique({ where: { id: auth.id }, select: { id: true, is_dealer: true } })
      : null
    const isDealer = !!authCustomer?.is_dealer

    const priced = await priceCart(body.cart, isDealer)
    if ('error' in priced) {
      if (priced.error.code === 'EMPTY_CART') {
        return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
      }
      return NextResponse.json(
        { code: 'UNAVAILABLE_ITEM', error: `Item "${priced.error.sku}" is no longer available. Please remove it from your cart.` },
        { status: 409 }
      )
    }

    const { subtotal, multiItemDiscount } = computeTotals(priced.lines, isDealer)
    const totalAmount = subtotal - multiItemDiscount // kargo hariç

    if (Math.abs(Number(body.totalAmount) - totalAmount) > 1) {
      return NextResponse.json(
        {
          code: 'PRICE_CHANGED',
          error: `Prices have been updated. New total: ${totalAmount} TRY. Please review and try again.`,
          prices: Object.fromEntries(priced.lines.map((l) => [l.sku, l.retailPrice])),
          totalAmount,
        },
        { status: 409 }
      )
    }

    const cart = priced.lines.map((l) => ({
      sku: l.sku, name: l.name, price: l.unitPrice, quantity: l.quantity,
      size: l.size, selectedScents: l.selectedScents, imageUrl: l.imageUrl,
    }))
    const orderNumber = 'PNI' + Date.now() + Math.floor(Math.random() * 1000)

    await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        discountApplied: multiItemDiscount,
        status: 'awaiting_transfer',
        paymentNote: `Yurt dışı sipariş (${customer.country}): havale/EFT bekleniyor; kargo ücreti talep üzerine belirlenip müşteriye e-postayla bildirilecek.`,
        items: cart,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: `${customer.address}\n${customer.country}`,
        customerId: authCustomer?.id || null,
        orderItems: {
          create: cart.map((i) => ({
            sku: String(i.sku),
            name: i.name || `PN ${i.sku}`,
            price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
            size: i.size || '50ml',
          })),
        },
      },
    })

    // E-postalar siparişi bozmamalı: hata olursa sipariş yine de kayıtlıdır.
    try {
      const { smtpHost, smtpUser, smtpPass, smtpPort } = await getIntegrationSettings()
      const transporter = nodemailer.createTransport({
        host: smtpHost || 'smtp.gmail.com',
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
      const lines = cart
        .map((i) => `${esc(i.quantity)} x PN ${esc(i.sku)} — ${esc(i.price)} TL`)
        .join('<br>')
      await transporter.sendMail({
        from: `"PN Parfüm Sipariş" <${smtpUser}>`,
        to: ['dogayozer@gmail.com', 'pnparfumsales@gmail.com'],
        replyTo: customer.email,
        subject: `Yurt dışı sipariş (havale): ${orderNumber} / ${customer.country}`,
        html: `
          <h2>Yurt Dışı Sipariş — Havale Bekleniyor</h2>
          <p><strong>Sipariş no:</strong> ${esc(orderNumber)}</p>
          <p><strong>Müşteri:</strong> ${esc(customer.name)} · ${esc(customer.email)} · ${esc(customer.phone)}</p>
          <p><strong>Ülke:</strong> ${esc(customer.country)}</p>
          <p><strong>Adres:</strong><br>${esc(customer.address)}</p>
          <p><strong>Ürünler:</strong><br>${lines}</p>
          <p><strong>Ürün toplamı (kargo hariç):</strong> ${esc(totalAmount)} TL</p>
          <p><strong>Yapılacak:</strong> kargo ücretini belirleyip müşteriye e-postayla havale bilgileriyle bildirin. Form dili: ${esc(locale)}</p>
        `,
      })
      await transporter.sendMail({
        from: `"PN Parfüm" <${smtpUser}>`,
        to: customer.email,
        subject: MAIL[locale].subject,
        html: MAIL[locale].body(orderNumber),
      })
    } catch (mailErr) {
      console.error('Yurt dışı sipariş e-postası gönderilemedi:', mailErr)
    }

    await notifyN8n('international_order', { orderNumber, country: customer.country, email: customer.email, totalAmount, locale })

    return NextResponse.json({ success: true, orderNumber, totalAmount })
  } catch (error) {
    console.error('Yurt dışı sipariş hatası:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 })
  }
}
