import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getIntegrationSettings } from '@/lib/integrationSettings'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Lütfen Ad Soyad, E-posta ve Mesaj alanlarını doldurunuz.' },
        { status: 400 }
      )
    }

    // Admin panelinden (Entegrasyonlar) yönetilen SMTP kimlik bilgileri ve bildirim
    // e-postası — önceden burada sabit "siparis@..." yazıyordu, muhasebe@pienparfume.com.tr
    // hiç bilgilendirilmiyordu.
    const { smtpUser, smtpPass, smtpHost, smtpPort, adminOrderEmail } = await getIntegrationSettings()
    const recipientEmails = adminOrderEmail || 'muhasebe@pienparfume.com.tr'

    // Form içeriği HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #c5a880; border-bottom: 2px solid #c5a880; padding-bottom: 10px;">PN Parfüm - Yeni İletişim Mesajı</h2>
        <p style="margin: 10px 0;"><strong>Gönderen Ad Soyad:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>E-Posta:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin: 10px 0;"><strong>Telefon:</strong> ${phone || 'Belirtilmedi'}</p>
        <p style="margin: 10px 0;"><strong>Konu:</strong> ${subject || 'Genel İletişim'}</p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="margin: 10px 0;"><strong>Mesaj İçeriği:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
          ${message}
        </div>
        <p style="font-size: 12px; color: #888888; margin-top: 25px; text-align: center;">
          Bu e-posta pnparfume.com iletişim formu aracılığıyla gönderilmiştir.
        </p>
      </div>
    `

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: `"PN Parfüm İletişim" <${smtpUser}>`,
        to: recipientEmails,
        replyTo: email,
        subject: `[İletişim Formu] ${subject || 'Yeni Mesaj'} - ${name}`,
        html: emailHtml,
      })
    } else {
      console.log('--- [CONTACT FORM SUBMISSION] ---')
      console.log('To:', recipientEmails)
      console.log('Name:', name)
      console.log('Email:', email)
      console.log('Phone:', phone)
      console.log('Subject:', subject)
      console.log('Message:', message)
      console.log('---------------------------------')
    }

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.'
    })
  } catch (error: any) {
    console.error('Contact Form Error:', error)
    return NextResponse.json(
      { success: false, error: 'Mesaj gönderilirken bir hata oluştu. Lütfen WhatsApp üzerinden ulaşınız.' },
      { status: 500 }
    )
  }
}
