import Link from "next/link"
import { ShieldCheck, Globe, Clock, Leaf } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 mt-0 md:mt-20 py-4 md:py-12 px-4 md:px-12 text-center text-sm text-foreground/50">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 md:gap-6">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full py-4 md:py-8 border-t border-foreground/10">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground">IFRA & AB Uyumlu</span>
            <span className="text-xs text-foreground/50">Küresel standartlarda güven</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Clock className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground">20 Yıllık Miras</span>
            <span className="text-xs text-foreground/50">Köklü üretim tecrübesi</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground">Global Ekosistem</span>
            <span className="text-xs text-foreground/50">Avrupa ve ötesinde satış ağı</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Leaf className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground">Sürdürülebilir Simya</span>
            <span className="text-xs text-foreground/50">Doğaya duyarlı laboratuvar</span>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 w-full">
          <p className="text-[10px] md:text-sm text-foreground/50">
            © {new Date().getFullYear()} PN PARFÜM. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm text-foreground/50">
            <span className="hover:text-foreground transition-colors cursor-not-allowed">Kolonyalar & Yapım Kitleri (Yakında)</span>
            <Link href="/kurumsal/girisimcilere-ozel" className="hover:text-foreground transition-colors">Girişimcilere Özel</Link>
            <Link href="/kurumsal/kurumsal-kimlik" className="hover:text-foreground transition-colors">Kurumsal Kimlik</Link>
            <Link href="/kurumsal/iletisim" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
        </div>

        {/* Yasal Linkler */}
        <div className="flex flex-wrap justify-center gap-3 text-[10px] md:text-[11px] text-foreground/40 mt-1">
          <a href="/yasal/mesafeli-satis-sozlesmesi.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</a>
          <a href="/yasal/on-bilgilendirme-formu.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Ön Bilgilendirme Formu</a>
          <a href="/yasal/iptal-ve-iade-kosullari.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">İptal ve İade Koşulları</a>
          <a href="/yasal/gizlilik-ve-guvenlik.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Gizlilik ve Güvenlik</a>
          <a href="/yasal/site-kullanim-sartlari.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Site Kullanım Şartları</a>
        </div>

        <div className="mt-2 pt-3 border-t border-foreground/5 w-full">
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
