import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import { MapPin, Package, FlaskConical, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'موزع عطور بالجملة من تركيا | PN Parfüm',
  description: 'PN Parfüm مُصنّع تركي للعطور يقدم توزيعًا بالجملة لعطور فاخرة بديلة. أكثر من 338 عطرًا جاهزًا، وتشكيلة زيوت عطرية خالية من الكحول.',
  keywords: ['موزع عطور تركيا', 'توزيع عطور بالجملة', 'مصنع عطور تركي', 'عطور بالجملة'],
  alternates: { canonical: 'https://pnparfume.com/ar/wholesale' },
  openGraph: {
    title: 'موزع عطور بالجملة من تركيا | PN Parfüm',
    description: 'مُصنّع تركي للعطور يقدم توزيعًا بالجملة لعطور فاخرة بديلة.',
    url: 'https://pnparfume.com/ar/wholesale',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website'
  }
}

export default function ArWholesalePage() {
  return (
    <div lang="ar" dir="rtl" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">التوزيع بالجملة</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          كونوا موزعين لعطور PN Parfüm في سوقكم
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          نُنتج ونُصدّر عطورًا فاخرة بديلة من مصنعنا الخاص في سيليفري، إسطنبول، تركيا. تعاونوا معنا في التوزيع بالجملة — أسعار تنافسية، كتالوج جاهز واسع، ودعم لوجستي لمنطقتكم.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <MapPin className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">صُنع في تركيا</h3>
          <p className="text-sm text-foreground/60">يُنتَج في مصنعنا الخاص بسيليفري، إسطنبول — تركيا من أكبر الدول المنتجة للعطور في العالم.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <Package className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">كتالوج يضم أكثر من 338 عطرًا</h3>
          <p className="text-sm text-foreground/60">كتالوج جاهز يشمل عطورًا رجالية ونسائية ومشتركة — لا حاجة للبدء من الصفر.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <FlaskConical className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">تشكيلة زيوت خالية من الكحول</h3>
          <p className="text-sm text-foreground/60">إلى جانب خط EDP الكحولي، ننتج أيضًا عطورًا زيتية (خالية من الكحول) — أسهل وأوفر تكلفة لشحن العينات.</p>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl bg-background">
          <ShieldCheck className="text-accent-gold mb-3" size={22} />
          <h3 className="font-medium text-lg mb-2">متوافق مع معايير IFRA والاتحاد الأوروبي</h3>
          <p className="text-sm text-foreground/60">تتبع تركيباتنا معايير الرابطة الدولية للعطور (IFRA) ومتطلبات لائحة مستحضرات التجميل الأوروبية.</p>
        </div>
      </div>

      <div className="mb-6 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">هل تريدون تأسيس علامتكم التجارية الخاصة بدلاً من ذلك؟</h2>
        <p className="text-foreground/60 mb-4">إذا كنتم تفضلون بناء علامة عطور خاصة بكم من الفكرة إلى الرف، فقد يكون برنامج التصنيع الخاص (Private Label) خيارًا أنسب لكم.</p>
        <Link href="/ar/private-label" className="text-accent-gold font-medium hover:underline">استكشفوا برنامج العلامة الخاصة ←</Link>
      </div>

      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">تعرفوا على استراتيجيتنا الكاملة لسوق الخليج</h2>
        <p className="text-foreground/60 mb-4">التسعير الأمثل، متطلبات SFDA وGSO وCITES، اتجاهات العود الحديث، وهندسة التغليف الفاخر — دليل شامل مبني على بيانات السوق.</p>
        <Link href="/ar/gulf-market-strategy" className="text-accent-gold font-medium hover:underline">اقرأوا الدليل الكامل ←</Link>
      </div>

      <B2BLeadForm defaultInterest="Distributor" lang="ar" />

      {/* middleware.ts kök sayfayı ("/") Körfez ülkelerinden gelen ziyaretçiler için
          buraya yönlendiriyor — geri dönmek isteyenler için bir çıkış yolu. */}
      <p className="text-center mt-10 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
