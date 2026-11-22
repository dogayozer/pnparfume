import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCustomer } from '@/lib/customerAuth'
import { priceCart, computeTotals } from '@/lib/checkoutPricing'
import { productLabel } from '@/lib/collections'
import { getTransferAccounts } from '@/lib/bankAccounts'
import { sendTransferOrderMails } from '@/lib/transferMail'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { notifyN8n } from '@/lib/n8n'

// Yurt dışı adresli siparişler: kart ödemesi (PayTR) yerine havale/EFT. Kargo ücreti
// talep üzerine belirlenir ve müşteriye e-postayla bildirilir; bu yüzden toplam tutar
// kargosuzdur. Fiyatlar PayTR akışındaki gibi sunucuda yeniden hesaplanır. Kupon kullanımı
// bu akışta desteklenmez (kupon tüketimi ödeme onayına bağlı olduğundan).

const clean = (v: unknown, max = 300) => String(v ?? '').trim().slice(0, max)

const TR_NAMES = ['türkiye', 'turkiye', 'turkey', 'tr', 'türkei', 'turquie']

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
    const customerNote = clean(body.note, 1000) || null

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
        paymentMethod: 'bank_transfer_intl',
        customerNote,
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
            name: i.name || productLabel(i.sku),
            price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
            size: i.size || '50ml',
          })),
        },
      },
    })

    // E-postalar siparişi bozmamalı: hata olursa sipariş yine de kayıtlıdır.
    const accounts = await getTransferAccounts('intl')
    try {
      await sendTransferOrderMails({
        kind: 'intl',
        orderNumber,
        locale,
        totalAmount,
        accounts,
        customer,
        note: customerNote,
        itemsText: cart.map((i) => `${i.quantity} x ${productLabel(i.sku)} — ${i.price} TL`).join('<br>'),
      })
    } catch (mailErr) {
      console.error('Yurt dışı sipariş e-postası gönderilemedi:', mailErr)
    }

    await notifyN8n('international_order', { orderNumber, country: customer.country, email: customer.email, totalAmount, locale })

    return NextResponse.json({ success: true, orderNumber, totalAmount, accounts })
  } catch (error) {
    console.error('Yurt dışı sipariş hatası:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 })
  }
}
