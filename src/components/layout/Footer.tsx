import Link from "next/link"
import { T } from "@/lib/i18n"
import { ShieldCheck, Globe, Clock, Leaf } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 mt-0 md:mt-20 py-4 md:py-12 px-4 md:px-12 text-center text-sm text-foreground/50">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 md:gap-6">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full py-4 md:py-8 border-t border-foreground/10">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground"><T tr="IFRA & AB Uyumlu" en="IFRA & EU Compliant" ar="متوافق مع IFRA والاتحاد الأوروبي" /></span>
            <span className="text-xs text-foreground/50"><T tr="Küresel standartlarda güven" en="Trust at global standards" ar="ثقة بمعايير عالمية" /></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Clock className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground"><T tr="20 Yıllık Miras" en="20 Years of Heritage" ar="إرث 20 عامًا" /></span>
            <span className="text-xs text-foreground/50"><T tr="Köklü üretim tecrübesi" en="Established manufacturing experience" ar="خبرة تصنيع راسخة" /></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground"><T tr="Global Ekosistem" en="Global Ecosystem" ar="منظومة عالمية" /></span>
            <span className="text-xs text-foreground/50"><T tr="Avrupa ve ötesinde satış ağı" en="Sales network across Europe and beyond" ar="شبكة مبيعات في أوروبا وخارجها" /></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Leaf className="text-accent-gold" size={24} />
            <span className="font-medium text-foreground"><T tr="Sürdürülebilir Simya" en="Sustainable Alchemy" ar="كيمياء مستدامة" /></span>
            <span className="text-xs text-foreground/50"><T tr="Doğaya duyarlı laboratuvar" en="A nature-conscious laboratory" ar="مختبر يراعي الطبيعة" /></span>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-4 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 w-full">
          <p className="text-[10px] md:text-sm text-foreground/50">
            © {new Date().getFullYear()} PN PARFÜM. <T tr="Tüm hakları saklıdır." en="All rights reserved." ar="جميع الحقوق محفوظة." />
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm text-foreground/50">
            <span className="hover:text-foreground transition-colors cursor-not-allowed"><T tr="Kolonyalar & Yapım Kitleri (Yakında)" en="Colognes & DIY Kits (Coming Soon)" ar="الكولونيا وأطقم الصنع (قريبًا)" /></span>
            <Link href="/kurumsal/markalarimiz" className="hover:text-foreground transition-colors"><T tr="Markalarımız" en="Our Brands" ar="علاماتنا" /></Link>
            <Link href="/kurumsal/girisimcilere-ozel" className="hover:text-foreground transition-colors"><T tr="Girişimcilere Özel" en="For Entrepreneurs" ar="لرواد الأعمال" /></Link>
            <Link href="/kurumsal/bayilik" className="hover:text-foreground transition-colors"><T tr="Bayilik" en="Dealership" ar="الوكالة" /></Link>
            <Link href="/kurumsal/distributorluk" className="hover:text-foreground transition-colors"><T tr="Distribütörlük" en="Distributorship" ar="التوزيع" /></Link>
            <Link href="/kurumsal/kurumsal-kimlik" className="hover:text-foreground transition-colors"><T tr="Kurumsal Kimlik" en="About Us" ar="من نحن" /></Link>
            <Link href="/kurumsal/iletisim" className="hover:text-foreground transition-colors"><T tr="İletişim" en="Contact" ar="اتصل بنا" /></Link>
          </div>
        </div>

        {/* Yasal Linkler */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] md:text-[11px] text-foreground/40 mt-1 leading-tight">
          <a href="/yasal/mesafeli-satis-sozlesmesi.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><T tr="Mesafeli Satış Sözleşmesi" en="Distance Sales Agreement" ar="عقد البيع عن بُعد" /></a>
          <a href="/yasal/on-bilgilendirme-formu.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><T tr="Ön Bilgilendirme Formu" en="Preliminary Information Form" ar="نموذج المعلومات المسبقة" /></a>
          <a href="/yasal/iptal-ve-iade-kosullari.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><T tr="İptal ve İade Koşulları" en="Cancellation & Returns" ar="شروط الإلغاء والإرجاع" /></a>
          <a href="/yasal/gizlilik-ve-guvenlik.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><T tr="Gizlilik ve Güvenlik" en="Privacy & Security" ar="الخصوصية والأمان" /></a>
          <a href="/yasal/site-kullanim-sartlari.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors"><T tr="Site Kullanım Şartları" en="Terms of Use" ar="شروط الاستخدام" /></a>
        </div>

        <div className="mt-1 pt-2 border-t border-foreground/5 w-full leading-none">
          <p className="text-xs text-foreground/40 tracking-wider lowercase">
            <a href="https://www.kobiklik.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-gold transition-colors">
              www.kobiklik.com
            </a>{' '}
            <T tr="teknoloji ile yaratılmıştır" en="built with technology" ar="صُنع بالتقنية" />
          </p>
        </div>
      </div>
    </footer>
  )
}
