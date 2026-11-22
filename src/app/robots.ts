import { MetadataRoute } from 'next'

// /_next/ BİLEREK engellenmez: Google sayfayı render ederken CSS/JS ve /_next/image görsellerine ihtiyaç duyar.
const BLOCKED = ['/hesap', '/api/', '/admin', '/sepet', '/profil', '/basarili', '/basarisiz', '/*?sort=', '/*?gender=', '/*?season=', '/*?occasion=', '/*?persona=', '/*?family=']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      // Model eğitimi botları tamamen kapalı.
      userAgent: ['GPTBot', 'ClaudeBot'],
      disallow: '/',
    }, {
      // GEO/AEO: yapay zekâ ARAMA ve cevap botları açıkça serbest (siteyi cevaplarda kaynak gösterebilsinler).
      // Bu botlar model eğitimi için değil, kullanıcı sorusuna anlık cevap/atıf için tarar.
      // (Belirli bir bot grubu "*" grubunu geçersiz kıldığı için engelli yollar burada da tekrarlanır.)
      userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User'],
      allow: '/',
      disallow: BLOCKED,
    }, {
      userAgent: '*',
      allow: '/',
      // 🔴 Sondaki "/" ile yazılan kurallar (ör. "/hesap/") robots.txt önek eşleştirmesinde
      // sadece "/hesap/..." alt yollarını bloklar, tam sayfa olan "/hesap" (sonunda / yok)
      // taranabilir kalırdı — admin paneli dahil. Sondaki "/" kaldırılarak hem tam sayfa
      // hem alt yollar (varsa) tek kuralla bloklanıyor.
      // Filtre/sıralama parametreli liste adresleri (sonsuz kombinasyon, her biri DB sorgusu).
      disallow: BLOCKED,
    }],
    sitemap: 'https://pnparfume.com/sitemap.xml',
    host: 'https://pnparfume.com',
  }
}
