import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as xlsx from 'xlsx';

// Vercel'de uzun süren Excel (veritabanı) işlemlerinin timeout'a (504) düşmemesi için
export const maxDuration = 60; 
// API'nin önbelleğe alınmasını (cache) engellemek için
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenmedi.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Varsayılan sayfa adını bulalım (genelde 'Ürünler' veya Sheet1)
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet) as any[];

    let newCount = 0;
    let updatedCount = 0;

    for (const row of rows) {
      const barcode = row['Barkod']?.toString();
      if (!barcode) continue;

      const title = row['Ürün Adı'] || 'İsimsiz Ürün';
      const referencePrice = parseFloat(row['Piyasa Satış Fiyatı (KDV Dahil)'] || 0);
      const salePrice = parseFloat(row['Trendyol\'da Satılacak Fiyat'] || row['Satış Fiyatı'] || 0);
      const stockQty = parseInt(row['Ürün Stok Adedi'] || '0', 10);
      
      const statusValue = row['Durum']?.toString().toLowerCase();
      // Durum normalizasyonu: 1 veya 1001 ise active, yoksa inactive
      const status = (statusValue === '1' || statusValue === '1001' || statusValue === 'active') ? 'active' : 'inactive';

      // Upsert mantığı: Barkod varsa güncelle, yoksa ekle
      const existingProduct = await prisma.product.findUnique({
        where: { barcode },
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { barcode },
          data: {
            title,
            reference_price: referencePrice,
            sale_price: salePrice,
            stock_qty: stockQty,
            status,
            last_synced_at: new Date(),
          },
        });
        
        // Fiyat değiştiyse History'ye ekle
        if (existingProduct.sale_price !== salePrice) {
          await prisma.priceHistory.create({
            data: {
              productId: existingProduct.id,
              oldPrice: existingProduct.sale_price,
              newPrice: salePrice,
            }
          });
        }
        updatedCount++;
      } else {
        await prisma.product.create({
          data: {
            barcode,
            slug: barcode, // basit slug
            title,
            reference_price: referencePrice,
            sale_price: salePrice,
            stock_qty: stockQty,
            status,
            last_synced_at: new Date(),
          },
        });
        newCount++;
      }
    }

    return NextResponse.json({
      message: 'Senkronizasyon tamamlandı.',
      newCount,
      updatedCount,
      totalProcessed: rows.length
    });

  } catch (error) {
    console.error("Senkronizasyon Hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
