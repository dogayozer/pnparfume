import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

// Google Analytics (GA4) ölçüm kimliği — tüm sayfalarda ziyaretçi/etkinlik
// takibi için. Gizli bir değer değil, istemci tarafında herkese açık çalışır.
const GA_MEASUREMENT_ID = 'G-XZC7243TVP'

// Google Tag Manager konteyner kimliği.
const GTM_CONTAINER_ID = 'GTM-K3Z7KQT5'

// SEO: Google'a markanın/sitenin kim olduğunu anlatan yapılandırılmış veri —
// önceden hiçbir sayfada schema.org işaretlemesi yoktu, bu da Google'ın siteyi
// güvenilir bir e-ticaret markası olarak tanımasını zorlaştırıyordu.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PN Parfüm',
  url: 'https://pnparfume.com',
  logo: 'https://pnparfume.com/icon.png',
  sameAs: [] as string[]
}
// Not: SearchAction (sitelinks arama kutusu) eklenmedi — /katalog şu an URL
// parametresiyle sunucu tarafında arama desteklemiyor (arama SearchModal
// bileşeniyle istemci tarafında çalışıyor), Google'a çalışmayan bir hedef
// vermemek için bu özellik atlandı.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PN Parfüm',
  url: 'https://pnparfume.com'
}
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import CartModal from '@/components/cart/CartModal'
import ChatWidget from '@/components/layout/ChatWidget'
import WhatsAppButton from '@/components/common/WhatsAppButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pnparfume.com'),
  title: 'PN Parfüm | Özel ve Niş Koku Deneyimi',
  description: 'Yapay zeka analiz ilkeleriyle teninize en uygun imza kokuyu keşfedin. Açık parfümde lüks ve kalıcılığın yeni adresi PN Parfüm.',
  keywords: [
    'açık parfüm', 'niş parfüm', 'kişiye özel parfüm', 'kalıcı parfüm',
    'erkek parfüm', 'parfüm erkek', 'kadın parfüm', 'unisex parfüm',
    'en iyi erkek parfümleri', 'kendi parfümünü yap', 'imza parfüm', 'imza koku',
    'Pien parfüm', 'indirimli parfüm', 'öğrenci parfüm', 'gece parfümü',
    'date parfümü', 'spor parfüm', 'günlük parfüm', 'ofis parfümü',
    'yaz parfümü', 'kış parfümü', 'odunsu parfüm', 'çiçeksi parfüm', 'tatlı parfüm'
  ],
  openGraph: {
    title: 'PN Parfüm | Özel ve Niş Koku Deneyimi',
    description: 'Yapay zeka analiz ilkeleriyle teninize en uygun imza kokuyu keşfedin.',
    url: 'https://pnparfume.com',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PN Parfüm | Özel ve Niş Koku Deneyimi',
    description: 'Yapay zeka analiz ilkeleriyle teninize en uygun imza kokuyu keşfedin.',
  },
  alternates: {
    canonical: 'https://pnparfume.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-accent-gold/30 selection:text-accent-gold overflow-x-hidden w-full`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google Tag Manager — strategy="beforeInteractive" Next.js'e bunu
            sunucudan gelen ilk HTML'in <head>'ine, sayfadaki başka hiçbir
            script'ten önce enjekte etmesini söyler (JSX'te nereye yazılırsa
            yazılsın Next.js otomatik olarak <head>'e taşır — GTM'in "mümkün
            olan en üst konum" talimatının Next.js App Router karşılığı). */}
        <Script id="gtm-init" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
        </Script>
        {/* Google Tag Manager (noscript) — body açılışının hemen ardından */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <CartModal />
          <ChatWidget />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
