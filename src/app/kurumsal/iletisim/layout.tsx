// iletisim/page.tsx bir 'use client' bileşeni olduğu için metadata burada (sunucu layout'ta) tanımlanır.
export const metadata = {
  title: 'İletişim | PN Parfüm (Pien Parfum)',
  description:
    'PN Parfüm Silivri/İstanbul merkez ofis ve laboratuvar: telefon (+90) 212 736 09 90, info@pnparfume.com, çalışma saatleri ve iletişim formu.',
  alternates: {
    canonical: 'https://pnparfume.com/kurumsal/iletisim',
    languages: {
      tr: 'https://pnparfume.com/kurumsal/iletisim',
      en: 'https://pnparfume.com/en/contact',
      ar: 'https://pnparfume.com/ar/contact',
      'x-default': 'https://pnparfume.com/en/contact',
    },
  },
  openGraph: {
    title: 'İletişim | PN Parfüm',
    description: 'Adres, telefon, e-posta ve iletişim formu.',
    url: 'https://pnparfume.com/kurumsal/iletisim',
    siteName: 'PN Parfüm',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children
}
