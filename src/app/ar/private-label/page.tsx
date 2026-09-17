import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import { Lightbulb, TestTube, Factory, PackageCheck, Truck } from 'lucide-react'

export const metadata = {
  title: 'تصنيع عطور خاص (Private Label) في تركيا | أنشئ علامتك | PN Parfüm',
  description: 'أنشئ علامتك التجارية الخاصة للعطور مع PN Parfüm — مُصنّع تركي يعمل بنظام العلامة الخاصة (Private Label) والتصنيع بالعقد (Contract Manufacturing). من الفكرة إلى العينة إلى الإنتاج إلى الرف.',
  keywords: ['تصنيع عطور خاص', 'إنشاء علامة عطور خاصة', 'تصنيع بالعقد عطور', 'private label عطور تركيا', 'مصنع عطور تركيا'],
  alternates: { canonical: 'https://pnparfume.com/ar/private-label' },
  openGraph: {
    title: 'تصنيع عطور خاص (Private Label) في تركيا | PN Parfüm',
    description: 'أنشئ علامتك التجارية الخاصة للعطور — مُصنّع تركي للتصنيع الخاص والتصنيع بالعقد.',
    url: 'https://pnparfume.com/ar/private-label',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website'
  }
}

const steps = [
  { icon: Lightbulb, title: 'الفكرة', desc: 'أخبرونا برؤية علامتكم — عائلة العطر، الطابع، والجمهور المستهدف.' },
  { icon: TestTube, title: 'العينة', desc: 'نُجهّز عينات بناءً على مكتبتنا العطرية الحالية أو حسب طلب مخصص.' },
  { icon: Factory, title: 'الإنتاج', desc: 'بعد الموافقة، يتم الإنتاج في مصنعنا الخاص بسيليفري، إسطنبول.' },
  { icon: PackageCheck, title: 'التغليف والملصق', desc: 'اختاروا الزجاجة والعلبة وخيارات الملصق — بهوية علامتكم الخاصة.' },
  { icon: Truck, title: 'الشحن', desc: 'يُجهّز منتجكم النهائي المُعبأ للتصدير إلى سوقكم.' },
]

export default function ArPrivateLabelPage() {
  return (
    <div lang="ar" dir="rtl" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">Private Label</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          أنشئ علامتك التجارية الخاصة للعطور
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          تُنتج PN Parfüm العطور في مصنعها الخاص بسيليفري، إسطنبول، تركيا. من خلال برنامج التصنيع الخاص (Private Label) والتصنيع بالعقد (Contract Manufacturing)، تُقدّمون العلامة التجارية — ونتولى نحن التركيب والإنتاج والتغليف.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">كيف تسير العملية</h2>
        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-5">
              <div className="w-11 h-11 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <s.icon className="text-accent-gold" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{i + 1}. {s.title}</h3>
                <p className="text-sm text-foreground/60">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">هل لديكم علامة تجارية بالفعل وتريدون الشراء بالجملة؟</h2>
        <p className="text-foreground/60 mb-4">إذا كنتم تفضلون توزيع كتالوجنا الحالي الذي يضم أكثر من 338 عطرًا تحت علامتنا، فقد يكون برنامج البيع بالجملة أنسب لكم.</p>
        <Link href="/ar/wholesale" className="text-accent-gold font-medium hover:underline">استكشفوا البيع بالجملة ←</Link>
      </div>

      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <h2 className="text-2xl font-light mb-4">تعرفوا على استراتيجيتنا الكاملة لسوق الخليج</h2>
        <p className="text-foreground/60 mb-4">التسعير الأمثل، متطلبات SFDA وGSO وCITES، اتجاهات العود الحديث، وهندسة التغليف الفاخر — دليل شامل مبني على بيانات السوق.</p>
        <Link href="/ar/gulf-market-strategy" className="text-accent-gold font-medium hover:underline">اقرأوا الدليل الكامل ←</Link>
      </div>

      <B2BLeadForm defaultInterest="Private Label" lang="ar" />

      {/* middleware.ts kök sayfayı ("/") Körfez ülkelerinden gelen ziyaretçiler için
          buraya yönlendiriyor — geri dönmek isteyenler için bir çıkış yolu. */}
      <p className="text-center mt-10 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
