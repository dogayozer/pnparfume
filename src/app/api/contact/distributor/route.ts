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
      companyName: clean(body.companyName, 150),
      contactName: clean(body.contactName, 120),
      email: clean(body.email, 150),
      phone: clean(body.phone, 40),
      country: clean(body.country, 80),
      city: clean(body.city, 80),
      website: clean(body.website, 200),
      hasSubDealers: clean(body.hasSubDealers, 40),
      subDealerCount: clean(body.subDealerCount, 40),
      hasExperience: clean(body.hasExperience, 40),
      experienceDetail: clean(body.experienceDetail, 1500),
      channels: clean(body.channels, 200),
      locale: ['tr', 'en', 'ar'].includes(body.locale) ? String(body.locale) : 'tr',
      message: clean(body.message, 2000),
    }

    if (
      !d.companyName || !d.contactName || !d.email || !d.phone ||
      !d.country || !d.city || !d.hasSubDealers || !d.hasExperience ||
      !body.consent
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
      from: `"PN Parfüm Distribütörlük Formu" <${smtpUser}>`,
      to: ['dogayozer@gmail.com', 'pnparfumsales@gmail.com'],
      replyTo: d.email,
      subject: `Yeni Distribütörlük Talebi (${d.locale.toUpperCase()}): ${d.country} / ${d.city}`,
      html: `
        <h2>Yeni Distribütörlük Talebi</h2>
        <p><strong>Form dili:</strong> ${esc(d.locale)}</p>
        <p><strong>Firma:</strong> ${esc(d.companyName)}</p>
        <p><strong>Yetkili:</strong> ${esc(d.contactName)}</p>
        <p><strong>E-posta:</strong> ${esc(d.email)}</p>
        <p><strong>Telefon / WhatsApp:</strong> ${esc(d.phone)}</p>
        <p><strong>Ülke:</strong> ${esc(d.country)}</p>
        <p><strong>Şehir / Bölge:</strong> ${esc(d.city)}</p>
        <p><strong>Web sitesi / sosyal medya:</strong> ${esc(d.website) || '-'}</p>
        <p><strong>Alt bayi ağı var mı:</strong> ${esc(d.hasSubDealers)}${d.subDealerCount ? ` (yaklaşık ${esc(d.subDealerCount)} alt bayi)` : ''}</p>
        <p><strong>Sektörde önceki deneyim:</strong> ${esc(d.hasExperience)}</p>
        <p><strong>Deneyim detayı:</strong><br>${esc(d.experienceDetail) || '-'}</p>
        <p><strong>Satış kanalları:</strong> ${esc(d.channels) || '-'}</p>
        <p><strong>Mesaj:</strong><br>${esc(d.message) || '-'}</p>
      `,
    })

    await notifyN8n('distributor_lead', { ...d, consent: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Distribütörlük formu hatası:', error)
    return NextResponse.json({ success: false, error: 'Gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' }, { status: 500 })
  }
}
