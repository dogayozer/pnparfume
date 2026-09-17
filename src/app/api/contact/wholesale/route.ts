import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getIntegrationSettings } from '@/lib/integrationSettings';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interest, country, companyName, contactName, email, whatsapp, website, volume, currentActivity, message } = body;

    if (!interest || !country || !companyName || !contactName || !email) {
      return NextResponse.json({ success: false, error: 'Please fill in the required fields.' }, { status: 400 });
    }

    // SMTP kimlik bilgileri admin panelinden (Entegrasyonlar) yönetiliyor, ama bu formun
    // alıcısı kasıtlı olarak adminOrderEmail'den (muhasebe/sipariş kutusu) bağımsız,
    // sabit tutuluyor — uluslararası distribütörlük/private-label başvuruları doğrudan
    // dogayozer@gmail.com'a gitsin diye (kullanıcının kendi talebi).
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
      from: `"PN Parfüm Wholesale Form" <${smtpUser}>`,
      to: 'dogayozer@gmail.com',
      subject: `New B2B Lead — ${interest} (${country})`,
      html: `
        <h2>New Wholesale / Private Label Inquiry</h2>
        <p><strong>Interest:</strong> ${interest}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Business Email:</strong> ${email}</p>
        <p><strong>WhatsApp / Phone:</strong> ${whatsapp || '-'}</p>
        <p><strong>Website:</strong> ${website || '-'}</p>
        <p><strong>Estimated Monthly Volume:</strong> ${volume || '-'}</p>
        <p><strong>Current Business:</strong> ${currentActivity || '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || '-'}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wholesale lead mail error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong while sending your request.' }, { status: 500 });
  }
}
