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
