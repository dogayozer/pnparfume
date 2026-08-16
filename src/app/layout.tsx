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
  title: 'PN Parfüm | Nöropazarlama Odaklı Kişisel Koku Deneyimi',
  description: 'Yapay zeka ve nöropazarlama ilkeleriyle sizin için en uygun kokuyu buluyoruz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-accent-gold/30 selection:text-accent-gold`}>
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
