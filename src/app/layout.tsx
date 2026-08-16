import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import CartModal from '@/components/cart/CartModal'
import ChatWidget from '@/components/layout/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pnparfume.com'),
  title: 'PN Parfüm | Özel ve Niş Koku Deneyimi',
  description: 'Yapay zeka analiz ilkeleriyle teninize en uygun imza kokuyu keşfedin. Açık parfümde lüks ve kalıcılığın yeni adresi PN Parfüm.',
  keywords: ['açık parfüm', 'niş parfüm', 'kişiye özel parfüm', 'kalıcı parfüm', 'erkek parfüm', 'kadın parfüm', 'Pien parfüm'],
  openGraph: {
    title: 'PN Parfüm | Özel ve Niş Koku Deneyimi',
    description: 'Yapay zeka analiz ilkeleriyle teninize en uygun imza kokuyu keşfedin.',
    url: 'https://pnparfume.com',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-accent-gold/30 selection:text-accent-gold`} suppressHydrationWarning>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <CartModal />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  )
}
