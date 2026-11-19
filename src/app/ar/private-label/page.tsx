import Link from 'next/link'
import B2BSubNav from '@/components/b2b/B2BSubNav'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import BrandPartnership from '@/components/b2b/BrandPartnership'
import { Lightbulb, TestTube, Factory, PackageCheck, Truck, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'تصنيع عطور خاص (Private Label) في تركيا | أنشئ علامتك | PN Parfüm',
  description: 'ننتج منذ عام 2002. أنشئ علامتك التجارية الخاصة للعطور مع PN Parfüm: 400 خيار عطري، إرشاد في تسجيل العلامة التجارية، وتصميم الشعار والزجاجة والعلبة والملصق، والتصنيع الخاص (Private Label) في تركيا.',
  keywords: [
    'تصميم شعار عطور', 'تصميم ملصق عطور', 'تصميم علبة عطور', 'تسجيل علامة عطور تجارية',
    'تصنيع عطور خاص', 'إنشاء علامة عطور خاصة', 'تصنيع بالعقد عطور', 'private label عطور تركيا',
    'مصنع عطور تركيا', 'فاصون عطور', 'OEM عطور تركيا', 'شركة تصنيع عطور بالعقد'
  ],
  alternates: {
    canonical: 'https://pnparfume.com/ar/private-label',
    languages: {
      'en': 'https://pnparfume.com/en/private-label',
      'ar': 'https://pnparfume.com/ar/private-label',
      'tr': 'https://pnparfume.com/kendi-parfum-markani-yarat',
      'x-default': 'https://pnparfume.com/en/private-label',
    }
  },
  openGraph: {
    title: 'تصنيع عطور خاص (Private Label) في تركيا | PN Parfüm',
    description: 'أنشئ علامتك التجارية الخاصة للعطور — مُصنّع تركي للتصنيع الخاص والتصنيع بالعقد.',
    url: 'https://pnparfume.com/ar/private-label',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website'
  }
}

const faqs = [
  {
    q: 'ما هو التصنيع بالعقد (Contract Manufacturing) للعطور؟',
    a: 'يعني أننا ننتج العطور تحت علامتكم التجارية الخاصة — تقدّمون الهوية والعلامة، ونتولى نحن التركيبة والإنتاج والتغليف بالكامل في مصنعنا بإسطنبول.'
  },
  {
    q: 'هل يمكنني استخدام تركيبة خاصة بي، أم يجب الاختيار من كتالوجكم؟',
    a: 'كلا الخيارين متاحان — يمكنكم الاختيار من بين 400 خيار عطري مختلف لتوفير الوقت والتكلفة، أو طلب تركيبة مخصصة بالكامل بناءً على بريف عطري خاص بعلامتكم.'
  },
  {
    q: 'هل تساعدون في تسجيل العلامة التجارية وتصميم الشعار والملصق؟',
    a: 'نعم. نرشدكم خطوة بخطوة في تسجيل العلامة التجارية، من التقديم إلى المتابعة، ونصمم معكم الشعار والهوية اللونية وملصقات الزجاجات. نتيجة طلب تسجيل العلامة تعتمد على الجهة المختصة.'
  },
  {
    q: 'هل يمكنكم مساعدتي في اختيار الزجاجات والعلب؟',
    a: 'نعم. عبر شركائنا من مصنّعي الزجاجات نقدم تشكيلة واسعة من الطرازات ونستشيركم في الأحجام المناسبة لاتجاهات السوق، وعبر مطابعنا المتعاقد معها نساعدكم في الحصول على أنسب سعر لتصميم علبتكم.'
  },
  {
    q: 'منذ متى تُنتج PN Parfüm العطور؟',
    a: 'تُنتج PN Parfüm (Pien Parfum) العطور منذ عام 2002. بخبرة 24 عامًا وعلاماتنا القائمة، نُسهّل العديد من خطوات التسجيل عند بناء مجموعتكم تحت علامتكم الخاصة.'
  },
  {
    q: 'ما هو الحد الأدنى لكمية الطلب لإنتاج Private Label؟',
    a: 'يختلف حسب نوع الزجاجة (جاهزة أو مخصصة التصميم) — خيارات الزجاجات الجاهزة تتيح بدء الطلب بكميات أصغر، بينما الزجاجات المخصصة تتطلب حدًا أدنى أعلى.'
  },
  {
    q: 'هل تركيباتكم متوافقة مع اللوائح التنظيمية الدولية ولوائح الاتحاد الأوروبي؟',
    a: 'نعم، جميع التركيبات تتبع معايير الرابطة الدولية للعطور (IFRA) ومتطلبات لائحة مستحضرات التجميل الأوروبية، مع توفر وثائق تقييم السلامة (CPSR) عند الطلب.'
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Private label perfume manufacturing and brand building',
  name: 'أنشئ علامتك التجارية الخاصة للعطور',
  inLanguage: 'ar',
  areaServed: 'Worldwide',
  provider: {
    '@type': 'Organization',
    name: 'PN Parfüm',
    alternateName: 'Pien Parfum',
    url: 'https://pnparfume.com',
    foundingDate: '2002',
  },
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
      <B2BSubNav locale="ar" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

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
        <BrandPartnership locale="ar" />
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

      <div className="mb-16">
        <h2 className="text-2xl font-light mb-8">الأسئلة الشائعة</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group border border-foreground/10 rounded-2xl p-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium gap-4">
                {f.q}
                <ChevronDown className="text-foreground/40 group-open:rotate-180 transition-transform flex-shrink-0" size={18} />
              </summary>
              <p className="text-sm text-foreground/60 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
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
