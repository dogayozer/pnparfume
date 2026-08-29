import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

// Admin panelinden düzenlenebilir SMS (NETGSM) / e-posta (SMTP) ayarları. Tek
// satırlık bir config kaydı (AiConfig ile aynı desen). Şifre alanları GET'te asla
// düz metin dönmez — sadece "tanımlı mı" bilgisi (hasX: true/false) döner, admin
// panelindeki form da bu alanları boş gösterip placeholder'la "•••• (değiştirmek
// için doldurun)" der; boş bırakılırsa PUT mevcut değeri korur.

async function getOrCreateSettings() {
  let settings = await prisma.integrationSettings.findFirst()
  if (!settings) {
    settings = await prisma.integrationSettings.create({ data: {} })
  }
  return settings
}

export async function GET(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json({
      netgsm_usercode: settings.netgsm_usercode || '',
      netgsm_header: settings.netgsm_header || '',
      hasNetgsmPassword: !!settings.netgsm_password,
      smtp_host: settings.smtp_host || '',
      smtp_port: settings.smtp_port || '',
      smtp_user: settings.smtp_user || '',
      hasSmtpPass: !!settings.smtp_pass,
      admin_order_email: settings.admin_order_email || ''
    })
  } catch (error) {
    console.error('Fetch integration settings error:', error)
    return NextResponse.json({ error: 'Ayarlar getirilemedi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  try {
    const body = await req.json()
    const current = await getOrCreateSettings()

    const updateData: any = {}
    if (body.netgsm_usercode !== undefined) updateData.netgsm_usercode = body.netgsm_usercode || null
    if (body.netgsm_password) updateData.netgsm_password = body.netgsm_password // boşsa dokunma
    if (body.netgsm_header !== undefined) updateData.netgsm_header = body.netgsm_header || null
    if (body.smtp_host !== undefined) updateData.smtp_host = body.smtp_host || null
    if (body.smtp_port !== undefined) updateData.smtp_port = body.smtp_port ? Number(body.smtp_port) : null
    if (body.smtp_user !== undefined) updateData.smtp_user = body.smtp_user || null
    if (body.smtp_pass) updateData.smtp_pass = body.smtp_pass // boşsa dokunma
    if (body.admin_order_email !== undefined) updateData.admin_order_email = body.admin_order_email || null

    const updated = await prisma.integrationSettings.update({
      where: { id: current.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      settings: {
        netgsm_usercode: updated.netgsm_usercode || '',
        netgsm_header: updated.netgsm_header || '',
        hasNetgsmPassword: !!updated.netgsm_password,
        smtp_host: updated.smtp_host || '',
        smtp_port: updated.smtp_port || '',
        smtp_user: updated.smtp_user || '',
        hasSmtpPass: !!updated.smtp_pass,
        admin_order_email: updated.admin_order_email || ''
      }
    })
  } catch (error: any) {
    console.error('Update integration settings error:', error)
    return NextResponse.json({ error: error.message || 'Ayarlar güncellenemedi' }, { status: 500 })
  }
}
