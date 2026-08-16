'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function KurumsalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { href: '/kurumsal/girisimcilere-ozel', label: 'Girişimcilere Özel' },
    { href: '/kurumsal/kurumsal-kimlik', label: 'Kurumsal Kimlik' },
    { href: '/kurumsal/iletisim', label: 'İletişim' }
  ]

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-12 md:px-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Kurumsal</h1>
        <p className="text-foreground/50 max-w-2xl">PN Parfüm dünyasının iş ve marka dinamikleri hakkında detaylı bilgiler.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {links.map(link => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
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
        <main className="flex-1 bg-foreground/[0.02] rounded-3xl p-6 md:p-10 border border-foreground/5">
          {children}
        </main>
      </div>
    </div>
  )
}
