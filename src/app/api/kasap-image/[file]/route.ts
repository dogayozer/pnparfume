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
    // Try /pnio/ first
    const req1 = http.get(`http://kasaptanetyiyelim.com/pnio/${safeFile}`, (res) => {
      if (res.statusCode === 200) {
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
      } else {
        // Fallback to /resim/
        http.get(`http://kasaptanetyiyelim.com/resim/${safeFile}`, (res2) => {
          if (res2.statusCode !== 200) {
            return resolve(new NextResponse('Image not found', { status: 404 }))
          }
          const chunks2: Buffer[] = []
          res2.on('data', (chunk) => chunks2.push(Buffer.from(chunk)))
          res2.on('end', () => {
            const buffer2 = Buffer.concat(chunks2)
            resolve(
              new NextResponse(buffer2, {
                status: 200,
                headers: {
                  'Content-Type': res2.headers['content-type'] || 'image/jpeg',
                  'Content-Length': buffer2.length.toString(),
                  'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
                },
              })
            )
          })
        }).on('error', (err2) => {
          console.error('Kasap image proxy error fallback:', err2)
          resolve(new NextResponse('Error fetching image', { status: 500 }))
        })
      }
    })

    req1.on('error', (err) => {
      console.error('Kasap image proxy error:', err)
      resolve(new NextResponse('Error fetching image', { status: 500 }))
    })
  })
}
