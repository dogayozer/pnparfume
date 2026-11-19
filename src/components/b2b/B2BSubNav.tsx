'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Locale = 'en' | 'ar'

const LINKS = {
  en: [
    ['/en/brands', 'Brands'],
    ['/en/private-label', 'Private Label'],
    ['/en/entrepreneurs', 'Entrepreneurs'],
    ['/en/dealership', 'Dealership'],
    ['/en/distributor', 'Distributor'],
    ['/en/wholesale', 'Wholesale'],
    ['/en/about', 'About'],
    ['/en/contact', 'Contact'],
  ],
  ar: [
    ['/ar/brands', 'العلامات'],
    ['/ar/private-label', 'العلامة الخاصة'],
    ['/ar/entrepreneurs', 'لرواد الأعمال'],
    ['/ar/dealership', 'الوكالة'],
    ['/ar/distributor', 'التوزيع'],
    ['/ar/wholesale', 'الجملة'],
    ['/ar/about', 'من نحن'],
    ['/ar/contact', 'اتصل بنا'],
  ],
} as const

export default function B2BSubNav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  return (
    <nav
      aria-label={locale === 'ar' ? 'صفحات الشركة' : 'Company pages'}
      className="mb-10 flex flex-wrap gap-2"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {LINKS[locale].map(([href, label]) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
              active
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                : 'border-foreground/10 text-foreground/65 hover:border-accent-gold/60 hover:text-foreground'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
