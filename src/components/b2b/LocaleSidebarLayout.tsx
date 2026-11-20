'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

type Locale = 'en' | 'ar'

const COPY = {
  en: {
    title: 'Corporate',
    desc: "Detailed information about PN Parfüm's business and brands.",
    aria: 'Company pages',
    links: [
      ['/en/brands', 'Brands'],
      ['/en/private-label', 'Private Label'],
      ['/en/entrepreneurs', 'Entrepreneurs'],
      ['/en/dealership', 'Dealership'],
      ['/en/distributor', 'Distributor'],
      ['/en/wholesale', 'Wholesale'],
      ['/en/about', 'About'],
      ['/en/contact', 'Contact'],
    ],
  },
  ar: {
    title: 'الشركة',
    desc: 'معلومات تفصيلية عن أعمال PN Parfüm وعلاماتها.',
    aria: 'صفحات الشركة',
    links: [
      ['/ar/brands', 'العلامات'],
      ['/ar/private-label', 'العلامة الخاصة'],
      ['/ar/entrepreneurs', 'لرواد الأعمال'],
      ['/ar/dealership', 'الوكالة'],
      ['/ar/distributor', 'التوزيع'],
      ['/ar/wholesale', 'الجملة'],
      ['/ar/about', 'من نحن'],
      ['/ar/contact', 'اتصل بنا'],
    ],
  },
} as const

// Türkçe "Kurumsal" düzeninin (sol menü + sağda içerik kartı) EN/AR karşılığı.
export default function LocaleSidebarLayout({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Mobilde menü başlığa dokununca açılır; masaüstünde her zaman açık.
  const [open, setOpen] = useState(false)
  const c = COPY[locale]
  const rtl = locale === 'ar'

  return (
    <div
      lang={locale}
      dir={rtl ? 'rtl' : 'ltr'}
      className="min-h-screen max-w-7xl mx-auto px-4 py-6 md:px-12 md:py-8"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl font-light mb-1.5">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls={`${locale}-corporate-menu`}
                className="flex w-full items-center justify-between gap-3 text-start md:pointer-events-none md:cursor-default"
              >
                <span>{c.title}</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-accent-gold md:hidden">
                  {c.links.find(([href]) => href === pathname)?.[1]}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
            </h1>
            <p className="text-sm text-foreground/50">{c.desc}</p>
          </div>
          <nav
            id={`${locale}-corporate-menu`}
            aria-label={c.aria}
            className={`${open ? 'flex' : 'hidden'} md:flex flex-col space-y-1`}
          >
            {c.links.map(([href, label]) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm font-medium ${
                    isActive
                      ? 'bg-foreground/5 text-accent-gold border-s-2 border-accent-gold'
                      : 'text-foreground/70 hover:bg-foreground/[0.02] hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 bg-foreground/[0.02] rounded-3xl p-4 md:p-8 border border-foreground/5">
          {children}
        </main>
      </div>
    </div>
  )
}
