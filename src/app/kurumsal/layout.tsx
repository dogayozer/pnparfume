'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Mobilde menü "Kurumsal" başlığına dokununca açılır; masaüstünde her zaman açık.
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/kurumsal/markalarimiz', label: 'Markalarımız' },
    { href: '/kurumsal/girisimcilere-ozel', label: 'Girişimcilere Özel' },
    { href: '/kurumsal/bayilik', label: 'Bayilik' },
    { href: '/kurumsal/bayilik/dijital', label: 'Dijital Bayilik' },
    { href: '/kurumsal/distributorluk', label: 'Distribütörlük' },
    { href: '/kurumsal/kurumsal-kimlik', label: 'Kurumsal Kimlik' },
    { href: '/kurumsal/iletisim', label: 'İletişim' }
  ]

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 md:px-12 md:py-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-10">
        {/* Sidebar: başlık menüyle aynı sütunda, içerik sağda en üstten başlar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl font-light mb-1.5">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="kurumsal-menu"
                className="flex w-full items-center justify-between gap-3 text-left md:pointer-events-none md:cursor-default"
              >
                <span>Kurumsal</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-accent-gold md:hidden">
                  <span className="underline decoration-accent-gold underline-offset-4">{links.find((l) => l.href === pathname)?.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                </span>
              </button>
            </h1>
            <p className="text-sm text-foreground/50">PN Parfüm dünyasının iş ve marka dinamikleri hakkında detaylı bilgiler.</p>
          </div>
          <nav id="kurumsal-menu" className={`${open ? 'flex' : 'hidden'} md:flex flex-col space-y-1`}>
            {links.map(link => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm font-medium ${
                    isActive 
                      ? 'bg-foreground/5 text-accent-gold border-l-2 border-accent-gold' 
                      : 'text-foreground/70 hover:bg-foreground/[0.02] hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-foreground/[0.02] rounded-3xl p-4 md:p-8 border border-foreground/5">
          {children}
        </main>
      </div>
    </div>
  )
}
