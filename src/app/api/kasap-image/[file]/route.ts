import { NextResponse } from 'next/server'
import http from 'http'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params
  const safeFile = encodeURIComponent(decodeURIComponent(file))

  return new Promise<NextResponse>((resolve) => {
    http.get(`http://kasaptanetyiyelim.com/pnio/${safeFile}`, (res) => {
      if (res.statusCode !== 200) {
        return resolve(new NextResponse('Image not found', { status: 404 }))
      }

      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      res.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(
          new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': res.headers['content-type'] || 'image/jpeg',
              'Content-Length': buffer.length.toString(),
              'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
            },
          })
        )
      })
    }).on('error', (err) => {
      console.error('Kasap image proxy error:', err)
      resolve(new NextResponse('Error fetching image', { status: 500 }))
    })
  })
}
