import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, website, message } = body;

    // Yeterli bilgi yoksa hata dön
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Lütfen zorunlu alanları doldurun.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // port 465 için true, 587 için false
      auth: {
        user: process.env.SMTP_USER, // e-posta adresiniz
        pass: process.env.SMTP_PASS, // şifreniz veya uygulama şifresi
      },
    });

    const mailOptions = {
      from: `"PN Parfüm Kurumsal Form" <${process.env.SMTP_USER}>`,
      to: 'muhasebe@pienparfume.com.tr, dogayozer@gmail.com',
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
