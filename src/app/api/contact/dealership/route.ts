import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getIntegrationSettings } from '@/lib/integrationSettings'
import { notifyN8n } from '@/lib/n8n'

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>')

const clean = (v: unknown, max = 300) => String(v ?? '').trim().slice(0, max)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Bot tuzağı: görünmez alan doluysa sessizce başarılı dön
    if (body.website2) return NextResponse.json({ success: true })

    const d = {
      shopName: clean(body.shopName, 150),
      contactName: clean(body.contactName, 120),
      email: clean(body.email, 150),
      phone: clean(body.phone, 40),
      country: clean(body.country, 80),
      city: clean(body.city, 80),
      businessType: clean(body.businessType, 80),
      salesChannel: clean(body.salesChannel, 80),
      interests: Array.isArray(body.interests) ? body.interests.slice(0, 8).map((x: unknown) => clean(x, 40)).join(', ') : '',
      message: clean(body.message, 2000),
      locale: ['tr', 'en', 'ar'].includes(body.locale) ? String(body.locale) : 'tr',
    }

    if (
      !d.shopName || !d.contactName || !d.email || !d.phone ||
      !d.city || !d.businessType || !d.salesChannel || !body.consent
    ) {
      return NextResponse.json({ success: false, error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
      return NextResponse.json({ success: false, error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 })
    }

    const { smtpHost, smtpUser, smtpPass, smtpPort } = await getIntegrationSettings()

    const transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })

    await transporter.sendMail({
      from: `"PN Parfüm Bayilik Formu" <${smtpUser}>`,
      to: ['dogayozer@gmail.com', 'pnparfumsales@gmail.com'],
      replyTo: d.email,
      subject: `Yeni Bayilik Talebi (${d.locale.toUpperCase()}): ${d.city}${d.country ? ' / ' + d.country : ''}`,
      html: `
        <h2>Yeni Bayilik Talebi</h2>
        <p><strong>Form dili:</strong> ${esc(d.locale)}</p>
        <p><strong>Mağaza / Firma:</strong> ${esc(d.shopName)}</p>
        <p><strong>Yetkili:</strong> ${esc(d.contactName)}</p>
        <p><strong>E-posta:</strong> ${esc(d.email)}</p>
        <p><strong>Telefon / WhatsApp:</strong> ${esc(d.phone)}</p>
        <p><strong>Ülke:</strong> ${esc(d.country) || '-'}</p>
        <p><strong>Şehir / İlçe:</strong> ${esc(d.city)}</p>
        <p><strong>İşletme türü:</strong> ${esc(d.businessType)}</p>
        <p><strong>Satış kanalı:</strong> ${esc(d.salesChannel)}</p>
        <p><strong>İlgilenilen seriler:</strong> ${esc(d.interests) || '-'}</p>
        <p><strong>Mesaj:</strong><br>${esc(d.message) || '-'}</p>
      `,
    })

    await notifyN8n('dealership_lead', { ...d, consent: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bayilik formu hatası:', error)
    return NextResponse.json({ success: false, error: 'Gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' }, { status: 500 })
  }
}
