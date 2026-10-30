import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      // Model eğitimi botları tamamen kapalı. Arama botları (OAI-SearchBot, Claude-SearchBot) engellenmez.
      userAgent: ['GPTBot', 'ClaudeBot'],
      disallow: '/',
    }, {
      userAgent: '*',
      allow: '/',
      // 🔴 Sondaki "/" ile yazılan kurallar (ör. "/hesap/") robots.txt önek eşleştirmesinde
      // sadece "/hesap/..." alt yollarını bloklar, tam sayfa olan "/hesap" (sonunda / yok)
      // taranabilir kalırdı — admin paneli dahil. Sondaki "/" kaldırılarak hem tam sayfa
      // hem alt yollar (varsa) tek kuralla bloklanıyor.
      // Filtre/sıralama parametreli liste adresleri (sonsuz kombinasyon, her biri DB sorgusu).
      disallow: ['/hesap', '/api/', '/_next/', '/admin', '/sepet', '/*?sort=', '/*?gender=', '/*?season=', '/*?occasion=', '/*?persona=', '/*?family='],
    }],
    sitemap: 'https://pnparfume.com/sitemap.xml',
  }
}
