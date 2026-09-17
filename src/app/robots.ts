import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 🔴 Sondaki "/" ile yazılan kurallar (ör. "/hesap/") robots.txt önek eşleştirmesinde
      // sadece "/hesap/..." alt yollarını bloklar, tam sayfa olan "/hesap" (sonunda / yok)
      // taranabilir kalırdı — admin paneli dahil. Sondaki "/" kaldırılarak hem tam sayfa
      // hem alt yollar (varsa) tek kuralla bloklanıyor.
      disallow: ['/hesap', '/api/', '/_next/', '/admin', '/sepet'],
    },
    sitemap: 'https://pnparfume.com/sitemap.xml',
  }
}
