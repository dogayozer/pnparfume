import { prisma } from '@/lib/prisma'

// Admin panelinden (Ayarlar > Entegrasyonlar) girilen kimlik bilgilerini okur; DB'de
// bir alan boşsa aynı isimdeki ortam değişkenine düşer. Böylece hem panelden hem
// Vercel ortam değişkenlerinden ayarlamak çalışır, panel her zaman önceliklidir.
// Daha önce sadece notificationEngine.ts içinde tanımlıydı; iletişim/ön başvuru
// formları da aynı SMTP kimlik bilgilerini ve aynı "bildirim e-postası" adresini
// kullanması gerektiği için (tek, tutarlı kaynak) buraya taşındı.
export async function getIntegrationSettings() {
  let db: Awaited<ReturnType<typeof prisma.integrationSettings.findFirst>> = null
  try {
    db = await prisma.integrationSettings.findFirst()
  } catch (e) {
    console.error('IntegrationSettings okunamadı, ortam değişkenlerine düşülüyor:', e)
  }
  return {
    netgsmUser: db?.netgsm_usercode || process.env.NETGSM_USERCODE,
    netgsmPass: db?.netgsm_password || process.env.NETGSM_PASSWORD,
    netgsmHeader: db?.netgsm_header || process.env.NETGSM_HEADER || 'PN PARFUM',
    smtpHost: db?.smtp_host || process.env.SMTP_HOST,
    smtpUser: db?.smtp_user || process.env.SMTP_USER,
    smtpPass: db?.smtp_pass || process.env.SMTP_PASS,
    smtpPort: db?.smtp_port || Number(process.env.SMTP_PORT) || 587,
    adminOrderEmail: db?.admin_order_email || 'muhasebe@pienparfume.com.tr'
  }
}
