import Link from 'next/link'
import B2BLeadForm from '@/components/b2b/B2BLeadForm'
import {
  TrendingUp, Layers, Sparkles, Tag, PackageCheck, ShieldCheck,
  Factory, ChevronDown
} from 'lucide-react'

export const metadata = {
  title: 'استراتيجية دخول سوق الخليج للعطور الفاخرة | PN Parfüm',
  description: 'ديناميكيات سوق دول مجلس التعاون الخليجي للعطور — طقوس التطييب بالطبقات، اتجاهات العود الحديث، متطلبات SFDA وGSO وCITES، والتسعير الأمثل. كيف يدعم مصنعنا في إسطنبول علامتكم في هذا السوق.',
  keywords: [
    'استراتيجية سوق الخليج للعطور', 'تصنيع عطور خليجي', 'متطلبات SFDA للعطور',
    'استيراد عطور السعودية', 'عطور حلال', 'موزع عطور الخليج', 'عود فيوجن',
    'تصنيع عطور بالجملة الإمارات'
  ],
  alternates: { canonical: 'https://pnparfume.com/ar/gulf-market-strategy' },
  openGraph: {
    title: 'استراتيجية دخول سوق الخليج للعطور الفاخرة | PN Parfüm',
    description: 'ديناميكيات سوق الخليج للعطور، متطلبات SFDA وCITES، والتسعير الأمثل لعلامتكم الفاخرة.',
    url: 'https://pnparfume.com/ar/gulf-market-strategy',
    siteName: 'PN Parfüm',
    locale: 'ar',
    type: 'website'
  }
}

const marketShare = [
  ['السعودية', '56.9%', 'الرائد المطلق — رؤية 2030، نمو سكاني وسياحي كبير (116 مليون زائر في 2024)'],
  ['الإمارات', '24.4%', 'مركز السياحة والتجارة الحرة العالمي، تركيز كبير للعلامات الفاخرة والنيش'],
  ['الكويت', '6.2%', 'إنفاق فردي مرتفع، ثقافة إهداء راسخة، طلب قوي على العود'],
  ['قطر', '5.1%', 'ثروة سيادية، ضيافة فاخرة، سياحة بعد الفعاليات الرياضية'],
  ['عُمان', '4.0%', 'إرث عطري ثقافي عميق وتقاليد صناعة الروائح اليدوية'],
  ['البحرين', '3.4%', 'أسرع الأسواق نموًا في الخليج (نمو سنوي 6.15%) — حركة تسوق حدودية من السعودية'],
]

const priceSegments = [
  ['50 – 100 دولار', 'منخفض / مدخل السوق', 'سوق جماهيري، استهلاك سريع، منافسة سعرية'],
  ['100 – 200 دولار', 'متوسط / بريميوم (~35%)', 'رفاهية ميسورة، ثقافة إهداء، منتجات مدخلية لعلامات عالمية'],
  ['200 دولار فأكثر', 'الشريحة الرائدة (54%)', 'مستخلصات عود نقية، هوية اجتماعية وثراء، الأكثر ولاءً للسعر'],
]

const faqs = [
  {
    q: 'ما هو نطاق السعر الموصى به لإطلاق علامة عطور فاخرة في السعودية أو الإمارات؟',
    a: 'تُظهر بيانات السوق أن شريحة 200-400 دولار هي نقطة الانطلاق المثلى — فهي الشريحة الرائدة (54% من السوق السعودي) والأكثر ولاءً للسعر. الدخول عبر المنافسة السعرية في شريحة 50-100 دولار غير موصى به لعلامة جديدة تسعى لبناء مكانة فاخرة.'
  },
  {
    q: 'هل تلتزمون بحظر SFDA الجديد للعبوات الشبيهة بالحقن الطبي؟',
    a: 'نعم. نحن على اطلاع كامل بقرار الهيئة العامة للغذاء والدواء السعودية (SFDA) الذي يحظر اعتبارًا من 1 يناير 2027 بيع مستحضرات التجميل الخارجية بعبوات على شكل حقنة أو أمبولة أو فيال طبي. نصمم عبوات عملائنا لتتوافق مع هذا القرار منذ مرحلة التصميم الأولى.'
  },
  {
    q: 'كم تستغرق عملية الحصول على تصريح CITES لزيت العود الطبيعي؟',
    a: 'إذا كانت تركيبتكم تحتوي على زيت عود طبيعي (Aquilaria)، فإن استخراج تصريح التصدير بموجب اتفاقية CITES يستغرق عادة 4 إلى 8 أسابيع، وقد يمتد إلى 2-3 أشهر خلال المواسم المزدحمة. نأخذ هذا الجدول الزمني بعين الاعتبار عند التخطيط لإنتاج أي تركيبة تحتوي على عود طبيعي خالص.'
  },
  {
    q: 'هل تساعدون في تسجيل المنتج عبر نظام GHAD السعودي؟',
    a: 'نوفر ملف المعلومات الفنية اللازم (قائمة المكونات بصيغة INCI مع النسب، شهادة GMP، شهادة البيع الحر CFS) الذي يحتاجه المستورد أو الوكيل المرخص لإتمام التبليغ عبر منصة GHAD، إضافة إلى الإرشاد بخصوص متطلبات الملصق العربي الإلزامي.'
  },
  {
    q: 'هل تنتجون تركيبات مناسبة لطقوس التطييب بالطبقات (Layering) في الخليج؟',
    a: 'نعم. مستهلك الخليج نادرًا ما يستخدم عطرًا واحدًا فقط — العادة المتبعة هي طبقات من العطر الزيتي أو العود، ثم البخور، وأخيرًا عطر كحولي غربي. هذا يستوجب تركيزًا وثباتًا عاليًا (Eau de Parfum بدلًا من Eau de Toilette الخفيف)، وهو بالضبط ما تُبنى عليه تركيباتنا، مع خيار الارتقاء إلى تركيز Extrait عند الطلب.'
  },
  {
    q: 'هل يمكنكم دمج اتجاهات "عود فيوجن" (Oud Fusion) الحديثة في تركيبة خاصة بعلامتي؟',
    a: 'نعم. نتابع عن قرب تحول ذائقة الجيل الجديد من العود التقليدي الثقيل إلى مزجه بنكهات الحمضيات والفانيليا والنوتات الغورميه (قهوة، فستق، كراميل) مع لمسات معدنية متباينة (ملح البحر، السمسم المحمص) — ونترجم هذا في briefing التركيبة الخاص بعلامتكم.'
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

export default function GulfMarketStrategyPage() {
  return (
    <div lang="ar" dir="rtl" className="min-h-screen max-w-5xl mx-auto px-6 py-16 md:px-12 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <div className="max-w-2xl mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-accent-gold">سوق الخليج (GCC)</span>
        <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6 leading-tight">
          استراتيجيتنا لسوق العطور الفاخرة في الخليج
        </h1>
        <p className="text-foreground/70 leading-relaxed text-lg">
          سوق دول مجلس التعاون الخليجي ليس مجرد سوق للعطور — بل هو أحد أكثر أسواق العطور نضجًا وربحية في العالم، بلغ فيه سوق الجمال الشخصي الفاخر 12.8 مليار دولار في 2024، ومن المتوقع أن يصل سوق العطور وحده إلى 5.31 مليار دولار بحلول 2031. نفهم خصوصية هذا السوق، ونبني منتجات وشراكات private label تراعي ثقافته وتنظيماته منذ اليوم الأول.
        </p>
      </div>

      {/* Ülke payları */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">توزيع السوق حسب الدولة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-right text-xs uppercase tracking-widest text-foreground/50">
                <th className="py-3 pl-4">الدولة</th>
                <th className="py-3 pl-4">حصة السوق</th>
                <th className="py-3">أبرز المحركات</th>
              </tr>
            </thead>
            <tbody className="text-foreground/70">
              {marketShare.map(([country, share, driver]) => (
                <tr key={country} className="border-b border-foreground/5">
                  <td className="py-3 pl-4 font-medium">{country}</td>
                  <td className="py-3 pl-4">{share}</td>
                  <td className="py-3">{driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Layering */}
      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">لماذا يختلف مستهلك الخليج؟ طقس "التطييب بالطبقات"</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-4">
          مستهلك الخليج نادرًا ما يخرج من المنزل برشة عطر واحدة. العادة المتوارثة هي: عطر زيتي كثيف أو عود نقي على بشرة نظيفة، ثم دخان بخور خاص يُشبع الشعر والملابس، وأخيرًا عطر كحولي غربي (تصميمي أو نيش) كطبقة ختامية.
        </p>
        <p className="text-foreground/60 leading-relaxed">
          هذا الطقس يجعل الثبات العالي والانتشار (silage) ضرورة تقنية وليس ميزة إضافية — لذا تحتل تركيزات <strong className="text-foreground/80">Eau de Parfum</strong> نحو 64.7% من السوق، بينما تُهزم تركيبات Eau de Toilette الخفيفة في هذا الطقس المكثف. تركيباتنا مبنية على هذا الأساس أصلًا، مع خيار الارتقاء إلى تركيز <strong className="text-foreground/80">Extrait</strong> عند الطلب لثبات أطول.
        </p>
      </div>

      {/* Trendler */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">اتجاهات 2026: من العود التقليدي إلى "عود فيوجن"</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">عود فيوجن (Oud Fusion)</h3>
            <p className="text-sm text-foreground/60">العود الثقيل التقليدي يُمزج الآن بالحمضيات والفانيليا الناعمة والنوتات الغورميه — يحافظ على الهوية الثقافية بينما يصبح أكثر عصرية وجاذبية لجيل الألفية وجيل Z.</p>
          </div>
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">غورميه بتباين معدني</h3>
            <p className="text-sm text-foreground/60">القهوة والفستق والكراميل والكستناء تتصدر النوتات الغورميه الجديدة، متوازنة بلمسات ملح البحر والسمسم المحمص والجلد الناعم لتجنب الحلاوة المفرطة وإضافة عمق فكري للتركيبة.</p>
          </div>
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">الطلب على الحلال والاستدامة</h3>
            <p className="text-sm text-foreground/60">الوعي المتزايد لدى المستهلك يجعل التركيبات الخالية من الكحول أو المصنّعة بكحول محلّل شرعًا، والخالية من أي تلوث بمشتقات حيوانية محظورة، ميزة تنافسية حقيقية وليست خيارًا هامشيًا.</p>
          </div>
          <div className="p-6 border border-foreground/10 rounded-2xl">
            <h3 className="font-medium mb-2">العطور المشتركة (Unisex)</h3>
            <p className="text-sm text-foreground/60">رغم أن عطور النساء تشكل 57% من السوق، فإن العطور المشتركة تكتسب حصة سوقية متزايدة بمعدل نمو سنوي 4.2%.</p>
          </div>
        </div>
      </div>

      {/* Fiyatlandırma */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Tag className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">التسعير والتموضع: لا تنافسوا على السعر المنخفض</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-6">
          سوق الخليج من أقل الأسواق حساسية للسعر عالميًا — السعر المرتفع نفسه يُقرأ كإشارة جودة (تأثير Veblen). التوصية بناءً على بيانات السوق:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-foreground/10 text-right text-xs uppercase tracking-widest text-foreground/50">
                <th className="py-3 pl-4">شريحة السعر</th>
                <th className="py-3 pl-4">حصة السوق السعودي</th>
                <th className="py-3">خصائص المستهلك</th>
              </tr>
            </thead>
            <tbody className="text-foreground/70">
              {priceSegments.map(([range, share, note]) => (
                <tr key={range} className="border-b border-foreground/5">
                  <td className="py-3 pl-4 font-medium">{range}</td>
                  <td className="py-3 pl-4">{share}</td>
                  <td className="py-3">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-foreground/50">
          تكلفة إنتاج الوحدة لعطر نيش عالي الجودة تتراوح عادة بين 15-35 دولارًا، بينما يمكن تسعيره في السوق الخليجي عند حوالي 250 دولارًا — الهامش الكبير ليس مبالغة، بل ضرورة صناعية لتمويل التسويق والتوزيع الفاخر.
        </p>
      </div>

      {/* Ambalaj */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <PackageCheck className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">هندسة التغليف الفاخر</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-6">
          في الخليج، الوزن والصلابة يُترجمان مباشرة إلى فخامة مُدركة. نوصي عملاءنا دائمًا بزجاجات ثقيلة القاعدة، أغطية معدنية (Zamak) بوزن 56-107 غرام بدلًا من البلاستيك الخفيف، وعلب خارجية صلبة الكتفين بإغلاق مغناطيسي وطباعة نافرة تُشبه تجربة فتح علبة مجوهرات.
        </p>
        <div className="p-6 border border-accent-gold/30 bg-accent-gold/5 rounded-2xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-accent-gold flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium mb-1">تنبيه تنظيمي مهم: حظر SFDA لعبوات الحقنة والأمبولة</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                اعتبارًا من 1 يناير 2027، تحظر الهيئة العامة للغذاء والدواء السعودية (SFDA) بيع مستحضرات التجميل الخارجية بعبوات تشبه الحقنة أو الأمبولة أو الفيال الطبي — لتجنب الخلط مع المنتجات الصيدلانية القابلة للحقن. المهلة الانتقالية للمنتجات الحالية في السوق تنتهي في 31 ديسمبر 2026. نأخذ هذا بعين الاعتبار منذ مرحلة تصميم العبوة لعملائنا.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mevzuat */}
      <div className="mb-16 p-8 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">الامتثال التنظيمي: GSO، SFDA وCITES</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed mb-4">
          جميع مستحضرات التجميل المباعة في الخليج يجب أن تلتزم بمعايير هيئة التقييس لدول مجلس التعاون الخليجي <strong className="text-foreground/80">GSO 1943:2024</strong> و<strong className="text-foreground/80">GSO 2528:2024</strong>. في السعودية تحديدًا، يتم التبليغ عبر منصة <strong className="text-foreground/80">GHAD</strong> التابعة لـ SFDA، ويتطلب ذلك قائمة مكونات بصيغة INCI مع النسب، ملف معلومات المنتج (PIF)، شهادة GMP، وشهادة البيع الحر (CFS) من بلد المنشأ. الملصق العربي على العبوة إلزامي ولا يمكن الاستعاضة عنه بالإنجليزية وحدها.
        </p>
        <p className="text-foreground/60 leading-relaxed">
          أما بالنسبة لزيت العود الطبيعي (Aquilaria)، فهو مُدرج ضمن الملحق الثاني لاتفاقية <strong className="text-foreground/80">CITES</strong> منذ 2004، ما يستوجب تصريح تصدير رسمي من بلد المنشأ يستغرق عادة 4-8 أسابيع. نتابع هذه المتطلبات عن قرب وندمجها في جدولة الإنتاج لأي تركيبة تحتوي على عود طبيعي خالص.
        </p>
      </div>

      {/* Neden Türkiye/PN Parfüm */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Factory className="text-accent-gold" size={22} />
          <h2 className="text-2xl font-light">لماذا تركيا، ولماذا PN Parfüm؟</h2>
        </div>
        <p className="text-foreground/60 leading-relaxed">
          موقع تركيا الاستراتيجي بين أوروبا وآسيا، مزايا الاتحاد الجمركي مع الاتحاد الأوروبي، وتكاليف تصنيع تنافسية، يجعلها قاعدة مثالية لتصنيع العطور المُصدَّرة لسوق الخليج. من مصنعنا في سيليفري، إسطنبول، نقدم لعملائنا نموذجًا متكاملًا (turnkey) — من التركيبة العالية الثبات المناسبة لطقس التطييب بالطبقات، إلى اختيار الزجاجة والغطاء والعلبة، وصولًا إلى التغليف النهائي بأحجام 30 و50 و100 مل — كل ذلك تحت مظلة واحدة.
        </p>
      </div>

      {/* SSS */}
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

      {/* Çapraz linkler */}
      <div className="mb-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 border border-foreground/10 rounded-2xl">
          <h3 className="font-medium mb-2">تريدون تأسيس علامتكم الخاصة؟</h3>
          <p className="text-sm text-foreground/60 mb-3">اطلعوا على برنامج التصنيع الخاص (Private Label) خطوة بخطوة.</p>
          <Link href="/ar/private-label" className="text-accent-gold text-sm font-medium hover:underline">استكشفوا Private Label ←</Link>
        </div>
        <div className="p-6 border border-foreground/10 rounded-2xl">
          <h3 className="font-medium mb-2">تفضلون التوزيع بالجملة؟</h3>
          <p className="text-sm text-foreground/60 mb-3">وزّعوا كتالوجنا الجاهز الذي يضم أكثر من 338 عطرًا تحت علامتنا.</p>
          <Link href="/ar/wholesale" className="text-accent-gold text-sm font-medium hover:underline">استكشفوا البيع بالجملة ←</Link>
        </div>
      </div>

      <B2BLeadForm defaultInterest="Private Label" lang="ar" />

      <p className="text-center mt-10 text-sm text-foreground/40">
        تبحثون عن متجرنا التركي؟ <Link href="/" className="text-accent-gold hover:underline">زوروا pnparfume.com</Link>
      </p>
    </div>
  )
}
