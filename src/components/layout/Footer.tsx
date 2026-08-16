import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 mt-20 py-12 px-6 md:px-12 text-center text-sm text-foreground/50">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="border-t border-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <p className="text-sm text-foreground/50">
            © {new Date().getFullYear()} PN PARFÜM. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/50">
            <Link href="/koleksiyonlar/kolonya-ve-kitler" className="hover:text-foreground transition-colors">Kolonyalar & Yapım Kitleri</Link>
            <Link href="/kurumsal/girisimcilere-ozel" className="hover:text-foreground transition-colors">Girişimcilere Özel</Link>
            <Link href="/kurumsal/kurumsal-kimlik" className="hover:text-foreground transition-colors">Kurumsal Kimlik</Link>
            <Link href="/kurumsal/iletisim" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-foreground/5 w-full">
          <p className="text-xs text-foreground/40 tracking-wider lowercase">
            <a href="https://www.kobiklik.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">
              www.kobiklik.com
            </a>{' '}
            teknoloji ile yaratılmıştır
          </p>
        </div>
      </div>
    </footer>
  )
}
