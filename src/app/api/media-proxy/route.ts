import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new NextResponse('URL parameter required', { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(targetUrl)
    
    // Only allow proxying from trusted domains
    if (!decodedUrl.includes('parfumtasarla.com') && !decodedUrl.includes('kasaptanetyiyelim.com') && !decodedUrl.includes('dsmcdn.com')) {
      return new NextResponse('Domain not allowed', { status: 403 })
    }

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (PN-Parfum-Proxy/1.0)',
      },
    })

    if (!response.ok) {
      return new NextResponse(`Upstream returned ${response.status}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Barındırma sağlayıcısının bot/DDoS koruması bazen gerçek görsel yerine
    // "One moment, please..." bekleme sayfasını HTTP 200 ile döndürüyor — bu kod
    // önceden her 200'ü "başarılı" sayıp 30 güne kadar (s-maxage) CDN'e önbelleğe
    // alıyordu. Bir kez bu sahte 200'e yakalanan bir ürün, upstream'de gerçek görsel
    // düzelse bile bizim önbelleğimizde bozuk (HTML) kalıyordu — gerçek bir olayda
    // (M 140, M 106) tam bunu gördük. Artık content-type gerçekten image/video
    // değilse (örn. text/html) başarısız sayılıyor ve HİÇ önbelleğe alınmıyor,
    // bir sonraki istek upstream'i tekrar dener.
    if (!contentType.startsWith('image/') && !contentType.startsWith('video/')) {
      return new NextResponse('Upstream did not return media (possibly a bot-check page)', {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('Media proxy error:', error)
    return new NextResponse('Error proxying media', { status: 500 })
  }
}
