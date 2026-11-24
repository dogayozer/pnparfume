import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Herkese açık, yalnızca görünürlük bayrakları (gizli bilgi yok). CDN'de 5 dk önbelleğe alınır.
export async function GET() {
  let whatsapp = false
  try {
    const s = await prisma.integrationSettings.findFirst({ select: { whatsapp_enabled: true } })
    whatsapp = !!s?.whatsapp_enabled
  } catch { /* sütun/DB yoksa varsayılan: gizli */ }
  return NextResponse.json({ whatsapp }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
}
