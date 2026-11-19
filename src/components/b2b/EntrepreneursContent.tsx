import Link from 'next/link'
import BrandPartnership from './BrandPartnership'
import B2BLeadForm from './B2BLeadForm'

type Locale = 'en' | 'ar'

export const ENTREPRENEURS = {
  en: {
    h: 'For Entrepreneurs: Build Your Own Perfume Brand',
    p1: 'PN Parfüm (Pien Parfum), producing perfume since 2002 and a pioneer in AI-assisted fragrance design, offers both ready-made products for entrepreneurs who want to start a profitable digital partnership and end-to-end contract manufacturing and regulatory guidance for those who want to build their own perfume brand from scratch.',
    p2: 'From the idea to the first sale, we make every stage transparent: choosing fragrance and concentration, samples and maceration, bottle and valve sourcing, ethyl alcohol regulation, allergen and label checks, and product notification files.',
    cards: [
      ['Contract manufacturing under your brand', 'Production in line with GMP principles, sample development, bottle/valve selection and technical file support, without building your own facility.'],
      ['Regulation and label assurance', 'IFRA Category 4 limits, the 82 fragrance allergens, label rules and the product notification process, with complete technical data.'],
      ['High margin and brand image', 'Buy directly from the manufacturer and reach competitive profitability online and in retail.'],
      ['API, marketing and wholesale', 'For partners who want to start fast with ready products: API infrastructure, visual and copy support and wholesale supply.'],
    ],
    pillarsT: 'How we support you',
    pillars: [
      ['Concept and fragrance strategy', 'Defining fragrance families that fit your audience, season and budget, and planning concentrations (EDT, EDP or Extrait de Parfum).'],
      ['Samples and maceration', 'Preparing test samples in your chosen fragrance profile and ratio, blending with high-purity bioethanol and managing the resting (maceration) period.'],
      ['Bottle, valve and packaging guidance', 'From main bottles to travel and tester sizes: glass bottle selection and planning FEA 15 (crimp) or screw-neck (15-415) valve systems.'],
      ['GMP and ethyl alcohol regulation', 'Handling ethyl alcohol transfer, denaturation and banderole procedures on a legal footing, and filling in line with ISO 22716 (GMP) principles.'],
      ['IFRA, allergens and label checks', 'IFRA Category 4 limit calculations, the 82-allergen declaration rules and label compliance checks.'],
      ['Testing, CPSR/PIF and notification support', 'Stability and packaging tests, microbiology documentation for high-alcohol products, CPSR/PIF technical data and guidance for the product notification process.'],
    ],
    branchesT: 'The six areas every perfume brand must plan',
    branches: [
      ['Legal responsibilities and regulation', 'Company structure, Responsible Person and technical responsible'],
      ['Trademark registration and digital infrastructure', 'Trademark office, GS1 barcodes, domain and e-commerce law'],
      ['Contract manufacturer selection and agreement', 'GMP facility, minimum quantity planning, NDA and alcohol regulation'],
      ['R&D, fragrance and packaging strategy', 'Concentration, IFRA Category 4, maceration, bottle and valve'],
      ['Label, allergens and prohibited claims', 'Label rules, 82 allergens and claims guidance'],
      ['Health authority and testing', 'Stability, microbiology, CPSR, PIF and product notification'],
    ],
    branchesNote: 'These areas describe the process for products placed on the Turkish market. For export, the rules of your destination market apply; ask our team for details.',
    faqT: 'Frequently Asked Questions',
    faqs: [
      ['Can I start with ready-made products instead of building my own brand?', 'Yes. You can start with our ready-made products as a digital partner, or create a series under the PN umbrella, or build your own brand with full contract manufacturing.'],
      ['Do you help with regulation and labels?', 'We guide you through the regulatory areas above and prepare the technical data we are responsible for. Outcomes of official applications depend on the relevant authorities.'],
      ['How long has PN Parfüm been manufacturing?', 'PN Parfüm (Pien Parfum) has been producing perfume since 2002, with 24 years of experience.'],
    ],
    moreT: 'See also',
    more: [['Private label manufacturing', '/en/private-label'], ['Our brands', '/en/brands'], ['Become a distributor', '/en/distributor']],
  },
  ar: {
    h: 'لرواد الأعمال: أنشئ علامة عطورك الخاصة',
    p1: 'تقدّم PN Parfüm (Pien Parfum)، التي تُنتج العطور منذ عام 2002 والرائدة في تصميم العطور بمساعدة الذكاء الاصطناعي، منتجات جاهزة لرواد الأعمال الراغبين في شراكة رقمية مربحة، وتصنيعًا بالعقد وإرشادًا تنظيميًا متكاملًا لمن يريدون بناء علامة عطورهم الخاصة من الصفر.',
    p2: 'من الفكرة إلى أول عملية بيع، نجعل كل مرحلة واضحة: اختيار العطر والتركيز، العينات والتعتيق، توريد الزجاجات والرشاشات، لوائح الإيثانول، فحص مسببات الحساسية والملصقات، وملفات إخطار المنتج.',
    cards: [
      ['التصنيع بالعقد تحت علامتك', 'إنتاج وفق مبادئ GMP، وتطوير العينات، واختيار الزجاجات والرشاشات ودعم الملف الفني، دون الحاجة لإنشاء مصنعك الخاص.'],
      ['ضمان اللوائح والملصقات', 'حدود IFRA للفئة 4، ومسببات الحساسية العطرية الـ82، وقواعد الملصقات وعملية إخطار المنتج، مع بيانات فنية كاملة.'],
      ['هامش ربح مرتفع وصورة علامة قوية', 'اشترِ مباشرة من المصنّع وحقق ربحية تنافسية عبر الإنترنت وفي التجزئة.'],
      ['واجهة برمجية وتسويق وجملة', 'للشركاء الراغبين بالبدء سريعًا بمنتجات جاهزة: بنية API ودعم للصور والنصوص وتوريد بالجملة.'],
    ],
    pillarsT: 'كيف ندعمك',
    pillars: [
      ['المفهوم والاستراتيجية العطرية', 'تحديد عائلات العطور المناسبة لجمهورك وموسمك وميزانيتك، وتخطيط التركيزات (EDT أو EDP أو Extrait de Parfum).'],
      ['العينات والتعتيق', 'تحضير عينات اختبار بالملف العطري والنسبة التي تختارها، والمزج بإيثانول حيوي عالي النقاء وإدارة فترة الراحة (التعتيق).'],
      ['إرشاد الزجاجات والرشاشات والتغليف', 'من الزجاجات الرئيسية إلى أحجام السفر والتستر: اختيار الزجاج وتخطيط أنظمة الرشاشات FEA 15 (كبس) أو اللولبية (15-415).'],
      ['GMP ولوائح الإيثانول', 'تنفيذ إجراءات نقل الإيثانول وتغييره (Denaturation) والأختام على أساس قانوني، والتعبئة وفق مبادئ ISO 22716 (GMP).'],
      ['IFRA ومسببات الحساسية والملصقات', 'حسابات حدود IFRA للفئة 4، وقواعد الإفصاح عن مسببات الحساسية الـ82، وفحص امتثال الملصقات.'],
      ['الاختبارات ودعم CPSR/PIF والإخطار', 'اختبارات الثبات والتغليف، ووثائق الأحياء الدقيقة للمنتجات عالية الكحول، وبيانات CPSR/PIF الفنية، وإرشاد عملية إخطار المنتج.'],
    ],
    branchesT: 'المجالات الستة التي يجب أن تخطط لها كل علامة عطور',
    branches: [
      ['المسؤوليات القانونية واللوائح', 'هيكل الشركة، الشخص المسؤول والمسؤول الفني'],
      ['تسجيل العلامة التجارية والبنية الرقمية', 'مكتب العلامات، باركود GS1، النطاق وقانون التجارة الإلكترونية'],
      ['اختيار المصنّع بالعقد والاتفاقية', 'منشأة GMP، تخطيط الحد الأدنى للكميات، اتفاقية السرية ولوائح الكحول'],
      ['البحث والتطوير والاستراتيجية العطرية والتغليف', 'التركيز، IFRA الفئة 4، التعتيق، الزجاجة والرشاش'],
      ['الملصق ومسببات الحساسية والادعاءات المحظورة', 'قواعد الملصقات، 82 مسبب حساسية وإرشاد الادعاءات'],
      ['الجهة الصحية والاختبارات', 'الثبات، الأحياء الدقيقة، CPSR وPIF وإخطار المنتج'],
    ],
    branchesNote: 'تصف هذه المجالات العملية الخاصة بالمنتجات المطروحة في السوق التركية. وعند التصدير تسري قواعد سوق الوجهة؛ اسألوا فريقنا للتفاصيل.',
    faqT: 'الأسئلة الشائعة',
    faqs: [
      ['هل يمكنني البدء بمنتجات جاهزة بدلًا من بناء علامتي الخاصة؟', 'نعم. يمكنك البدء بمنتجاتنا الجاهزة كشريك رقمي، أو إنشاء سلسلة تحت مظلة PN، أو بناء علامتك الخاصة بتصنيع كامل بالعقد.'],
      ['هل تساعدون في اللوائح والملصقات؟', 'نرشدكم في المجالات التنظيمية أعلاه ونعد البيانات الفنية التي نتولاها. تعتمد نتائج الطلبات الرسمية على الجهات المختصة.'],
      ['منذ متى تُنتج PN Parfüm؟', 'تُنتج PN Parfüm (Pien Parfum) العطور منذ عام 2002، بخبرة 24 عامًا.'],
    ],
    moreT: 'انظروا أيضًا',
    more: [['التصنيع الخاص (Private Label)', '/ar/private-label'], ['علاماتنا', '/ar/brands'], ['كن موزّعًا', '/ar/distributor']],
  },
} as const

export function entrepreneursJsonLd(locale: Locale, url: string) {
  const c = ENTREPRENEURS[locale]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale,
      mainEntity: c.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Private label perfume manufacturing and brand building',
      name: c.h,
      url,
      inLanguage: locale,
      areaServed: 'Worldwide',
      provider: { '@type': 'Organization', name: 'PN Parfüm', alternateName: 'Pien Parfum', url: 'https://pnparfume.com', foundingDate: '2002' },
    },
  ]
}

export default function EntrepreneursContent({ locale }: { locale: Locale }) {
  const c = ENTREPRENEURS[locale]
  const rtl = locale === 'ar'

  return (
    <div lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="space-y-16">
      <div className="space-y-4">
        <h2 className="text-3xl font-light text-accent-gold">{c.h}</h2>
        <p className="max-w-3xl leading-relaxed text-foreground/70">{c.p1}</p>
        <p className="max-w-3xl leading-relaxed text-foreground/70">{c.p2}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {c.cards.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-foreground/10 bg-background p-6">
            <h3 className="mb-2 text-lg font-medium">{t}</h3>
            <p className="text-sm leading-relaxed text-foreground/60">{d}</p>
          </div>
        ))}
      </div>

      <BrandPartnership locale={locale} />

      <section className="space-y-6">
        <h3 className="text-2xl font-light">{c.pillarsT}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.pillars.map(([t, d], i) => (
            <div key={t} className="rounded-2xl border border-foreground/10 bg-background p-5">
              <p className="mb-2 text-xs tracking-[0.2em] rtl:tracking-normal text-accent-gold">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="mb-2 font-medium">{t}</h4>
              <p className="text-sm leading-relaxed text-foreground/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-light">{c.branchesT}</h3>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.branches.map(([t, d], i) => (
            <li key={t} className="flex items-start gap-4 rounded-2xl border border-foreground/10 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-gold/60 text-sm text-accent-gold">{i + 1}</span>
              <div>
                <p className="font-medium">{t}</p>
                <p className="text-sm text-foreground/60">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-foreground/50">{c.branchesNote}</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-2xl font-light">{c.faqT}</h3>
        {c.faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{a}</p>
          </details>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-light">{c.moreT}</h3>
        <div className="flex flex-wrap gap-3">
          {c.more.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-foreground/15 px-5 py-2 text-sm hover:border-accent-gold hover:text-accent-gold">
              {label}
            </Link>
          ))}
        </div>
      </section>

      <B2BLeadForm defaultInterest="Private Label" lang={locale} />
    </div>
  )
}
