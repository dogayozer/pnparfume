import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getIntegrationSettings } from '@/lib/integrationSettings';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, website, message } = body;

    // Yeterli bilgi yoksa hata dön
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 });
    }

    // Admin panelinden (Entegrasyonlar) yönetilen SMTP kimlik bilgileri — alıcı ise
    // kasıtlı olarak adminOrderEmail'den bağımsız, sabit dogayozer@gmail.com (kullanıcının
    // kendi talebi: sitedeki tüm form bildirimleri bu adrese gitsin).
    const { smtpHost, smtpUser, smtpPass, smtpPort } = await getIntegrationSettings();

    const transporter = nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"PN Parfüm Kurumsal Form" <${smtpUser}>`,
      to: 'dogayozer@gmail.com',
      subject: 'Yeni Kurumsal Ön Başvuru Formu',
      html: `
        <h2>Yeni Bir Kurumsal Ön Başvuru Alındı</h2>
        <p><strong>Ad Soyad / Firma Adı:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Web Sitesi / Sosyal Medya:</strong> ${website}</p>
        <p><strong>Satış Stratejisi / Mesaj:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Başvurunuz başarıyla gönderildi.' });
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    return NextResponse.json({ success: false, error: 'Mail gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}
