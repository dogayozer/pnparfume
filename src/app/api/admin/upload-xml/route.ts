import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { XMLParser } from 'fast-xml-parser'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const xmlData = await file.text()
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    })
    const parsedData = parser.parse(xmlData)
    
    // We assume the products are inside a <Products> or <Items> array.
    // The exact path depends on the XML structure, which we asked the user about.
    // For now, we will just simulate finding an array of items.
    let items = parsedData?.Products?.Product || parsedData?.Items?.Item || parsedData?.urunler?.urun || []
    if (!Array.isArray(items)) {
      if (items) items = [items]
      else items = []
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'XML file is empty or unsupported format' }, { status: 400 })
    }

    let created = 0
    let updated = 0

    for (const item of items) {
      // Dynamic extraction based on typical XML fields
      const barcode = String(item.Barcode || item.Barkod || item.barkod || item.sku || '').trim()
      if (!barcode) continue

      const title = String(item.Name || item.UrunAdi || item.title || 'İsimsiz Ürün')
      const categoryName = String(item.Category || item.Kategori || 'Parfüm')
      const priceStr = String(item.Price || item.Fiyat || item.satis_fiyati || '0')
      const salePrice = parseFloat(priceStr.replace(',', '.')) || 0
      const stockQtyStr = String(item.Stock || item.Stok || item.miktar || '0')
      const stockQty = parseInt(stockQtyStr) || 0
      
      let category = await prisma.category.findUnique({ where: { slug: categoryName } })
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categoryName,
            template_type: 'generic',
          }
        })
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + barcode
      const status = stockQty > 0 ? 'active' : 'out_of_stock'

      const productData = {
        title: title,
        slug: slug,
        categoryId: category.id,
        sale_price: salePrice,
        stock_qty: stockQty,
        status: status,
        description_raw: String(item.Description || item.Aciklama || ''),
        volume_ml: parseInt(String(item.Volume || item.Hacim || 0)) || null,
        brand: String(item.Brand || item.Marka || 'Pien Parfume'),
      }

      const existingProd = await prisma.product.findUnique({ where: { barcode } })
      
      let currentProductId = ''
      if (existingProd) {
        const updatedProd = await prisma.product.update({
          where: { barcode },
          data: productData
        })
        currentProductId = updatedProd.id
        updated++
      } else {
        const createdProd = await prisma.product.create({
          data: {
            barcode,
            ...productData
          }
        })
        currentProductId = createdProd.id
        created++
      }

      // Handle Image
      const imgUrl = String(item.Image || item.Resim || item.Resim1 || item.Image1 || '')
      if (imgUrl && imgUrl.startsWith('http')) {
        await prisma.productImage.deleteMany({ where: { productId: currentProductId } })
        await prisma.productImage.create({
          data: {
            productId: currentProductId,
            url: imgUrl,
            originalUrl: imgUrl,
            order: 0
          }
        })
      }
    }

    await prisma.xmlSyncLog.create({
      data: {
        filename: file.name,
        status: 'success',
        summary: `Created: ${created}, Updated: ${updated}`,
        completedAt: new Date()
      }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ 
      success: true, 
      summary: { total: items.length, created, updated } 
    })

  } catch (error: unknown) {
    console.error('XML upload error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
