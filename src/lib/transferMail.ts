import nodemailer from 'nodemailer'
import { getIntegrationSettings } from '@/lib/integrationSettings'
import { bankAccountsHtml, type PublicBankAccount } from '@/lib/bankAccounts'

type Locale = 'tr' | 'en' | 'ar'

// Sitedeki gösterim kuru (src/lib/i18n.tsx USD_RATE ile aynı): yurt dışı siparişte ürün toplamı dolar olarak gösterilir.
const USD_RATE = 50

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')

const SUBJECT: Record<Locale, string> = {
  tr: 'Siparişiniz alındı (havale ile ödeme)',
  en: 'We have received your order (bank transfer payment)',
  ar: 'تم استلام طلبك (الدفع بالتحويل البنكي)',
}

function customerBody(locale: Locale, kind: 'tr' | 'intl', orderNumber: string, totalAmount: number) {
  if (locale === 'tr') {
    return kind === 'tr'
      ? `<p>Siparişiniz (${esc(orderNumber)}) alındı. Teşekkür ederiz.</p><p>Ödenecek tutar: <strong>${esc(totalAmount)} TL</strong>. Aşağıdaki hesaba havale/EFT yaptığınızda ödemeniz onaylanır ve siparişiniz hazırlanır.</p>`
      : `<p>Siparişiniz (${esc(orderNumber)}) alındı. Teşekkür ederiz.</p><p>Yurt dışı gönderilerde ödeme havale/EFT ile yapılır ve kargo ücreti talebiniz üzerine belirlenir. Ekibimiz kargo ücretini size e-postayla bildirecektir. Ürün toplamı (kargo hariç): <strong>≈ $${Math.round(totalAmount / USD_RATE)}</strong>.</p>`
  }
  if (locale === 'ar') {
    return kind === 'tr'
      ? `<p dir="rtl">تم استلام طلبك (${esc(orderNumber)}). شكرًا لك.</p><p dir="rtl">المبلغ المطلوب: <strong>${esc(totalAmount)} ليرة</strong>. بعد التحويل إلى الحساب أدناه يتم تأكيد الدفع وتجهيز طلبك.</p>`
      : `<p dir="rtl">تم استلام طلبك (${esc(orderNumber)}). شكرًا لك.</p><p dir="rtl">في الشحنات الدولية يتم الدفع بالتحويل البنكي، وتُحدَّد تكلفة الشحن بناءً على طلبك وسنرسلها لك بالبريد الإلكتروني. إجمالي المنتجات (بدون الشحن): <strong>≈ $${Math.round(totalAmount / USD_RATE)}</strong>.</p>`
  }
  return kind === 'tr'
    ? `<p>We have received your order (${esc(orderNumber)}). Thank you.</p><p>Amount due: <strong>${esc(totalAmount)} TRY</strong>. Your payment is confirmed and the order is prepared once the bank transfer to the account below is received.</p>`
    : `<p>We have received your order (${esc(orderNumber)}). Thank you.</p><p>For shipments abroad, payment is made by bank transfer and the shipping cost is determined on request; we will email it to you. Products total (excluding shipping): <strong>≈ $${Math.round(totalAmount / USD_RATE)}</strong>.</p>`
}

export type TransferOrderMailInput = {
  kind: 'tr' | 'intl'
  orderNumber: string
  locale: Locale
  totalAmount: number
  accounts: PublicBankAccount[]
  customer: { name: string; email: string; phone: string; address: string; country?: string }
  note: string | null
  itemsText: string
}

// E-postalar siparişi bozmamalı: çağıran taraf hatayı yutar, sipariş yine de kayıtlıdır.
export async function sendTransferOrderMails(input: TransferOrderMailInput) {
  const { kind, orderNumber, locale, totalAmount, accounts, customer, note, itemsText } = input
  const { smtpHost, smtpUser, smtpPass, smtpPort } = await getIntegrationSettings()
  const transporter = nodemailer.createTransport({
    host: smtpHost || 'smtp.gmail.com',
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const title = kind === 'tr' ? 'Havale Bekleniyor (Türkiye)' : 'Yurt Dışı Sipariş — Havale Bekleniyor'
  const amountLine =
    kind === 'tr'
      ? `${esc(totalAmount)} TL`
      : `${esc(totalAmount)} TL, kargo hariç (müşteriye gösterilen: ≈ $${Math.round(totalAmount / USD_RATE)}, kur 1 USD = ${USD_RATE} TL)`

  await transporter.sendMail({
    from: `"PN Parfüm Sipariş" <${smtpUser}>`,
    to: ['dogayozer@gmail.com', 'pnparfumsales@gmail.com'],
    replyTo: customer.email,
    subject: `${kind === 'tr' ? 'Havale siparişi' : 'Yurt dışı sipariş (havale)'}: ${orderNumber}${customer.country ? ' / ' + customer.country : ''}`,
    html: `
      <h2>${esc(title)}</h2>
      <p><strong>Sipariş no:</strong> ${esc(orderNumber)}</p>
      <p><strong>Müşteri:</strong> ${esc(customer.name)} · ${esc(customer.email)} · ${esc(customer.phone)}</p>
      ${customer.country ? `<p><strong>Ülke:</strong> ${esc(customer.country)}</p>` : ''}
      <p><strong>Adres:</strong><br>${esc(customer.address)}</p>
      <p><strong>Ürünler:</strong><br>${itemsText}</p>
      <p><strong>Tutar:</strong> ${amountLine}</p>
      ${note ? `<p><strong>Müşteri açıklaması:</strong><br>${esc(note)}</p>` : ''}
      <p><strong>Yapılacak:</strong> ${
        kind === 'tr'
          ? 'Havale gelince admin panelinde siparişi "Ödeme Alındı" yapın.'
          : 'kargo ücretini belirleyip müşteriye e-postayla bildirin; havale gelince siparişi "Ödeme Alındı" yapın.'
      } Form dili: ${esc(locale)}</p>
    `,
  })

  await transporter.sendMail({
    from: `"PN Parfüm" <${smtpUser}>`,
    to: customer.email,
    subject: SUBJECT[locale],
    html: `${customerBody(locale, kind, orderNumber, totalAmount)}${bankAccountsHtml(accounts, orderNumber, locale)}<p${locale === 'ar' ? ' dir="rtl"' : ''}>PN Parfüm / pnparfume.com</p>`,
  })
}
