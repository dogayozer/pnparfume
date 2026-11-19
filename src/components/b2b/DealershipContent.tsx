import Image from 'next/image'
import Link from 'next/link'
import DealerFilm from './DealerFilm'
import DealershipForm from './DealershipForm'

type Locale = 'tr' | 'en' | 'ar'

export const DEALERSHIP = {
  tr: {
    eyebrow: 'Bayilik',
    h: 'PN Parfüm Bayisi Olun',
    lead: 'Kendi mağazanızda ya da online satış kanalınızda PN Parfüm ürünlerini sunun. Küçük bir dükkândan büyük bir hikâyeye: filmi izleyin, formu doldurun, ekibimiz sizinle iletişime geçsin.',
    cta: 'Bayilik Formuna Git',
    heroAlt: 'PN Parfume tabelası ve raflarında PN kutuları bulunan şık, küçük bir parfüm mağazası',
    filmT: 'Bir bayilik hikâyesi',
    filmP: 'Küçük bir dükkândan başlayan bir hikâyeyi izleyin; bayilik yolculuğunun nasıl başlayabileceğini kısaca görün.',
    whyT: 'Neden PN Parfüm bayisi olmalı?',
    why: [
      ['Her bütçeye uygun seriler', 'Günlük kullanıma yönelik ekonomik serilerden lüks koleksiyonlara kadar altı marka ve seri.'],
      ['Doğrudan üreticiden', 'Silivri/İstanbul’daki merkez ofis ve laboratuvarımızda üretim yapan bir markayla çalışırsınız.'],
      ['24 yıllık tecrübe', '2002’den beri üretimdeyiz; köklü markalarımızla sağlam bir iş ortaklığı zemini.'],
      ['Satışa hazır sunum', 'Ürünlerinizi tanıtmanız için görsel ve içerik desteğini ekibimizle görüşebilirsiniz.'],
    ],
    stepsT: 'Bayilik süreci',
    steps: [
      ['Formu doldurun', 'Mağaza/işletme, şehir ve ilgilendiğiniz serileri paylaşın.'],
      ['Ekibimiz değerlendirsin', 'Başvurunuz bölge ve işletme yapınız açısından incelenir.'],
      ['Görüşelim', 'Uygun görülen başvurularda ürün ve koşullar birlikte görüşülür.'],
    ],
    notT: 'Önemli bilgi',
    not: 'Bayilik başvurusu bir ön taleptir; fiyat, minimum adet ve sözleşme koşulları değerlendirmeden sonra görüşülür. Bayilik, ürünlerin toptan alınıp kendi işletmenizde satılması esasına dayanır; franchise veya mağaza açma desteği içermez.',
    diffT: 'Ülke veya bölge temsilcisi mi olmak istiyorsunuz?',
    diff: 'Bir ülkede ya da şehirde birden fazla satış noktasına ürün sağlayacak bir iş modeli için Distribütörlük sayfamızı inceleyin.',
    diffCta: 'Distribütörlük başvurusu',
    diffHref: '/kurumsal/distributorluk',
    formT: 'Bayilik Başvuru Formu',
    formP: 'İşletmenizi ve ilgilendiğiniz serileri paylaşın.',
    faqT: 'Sıkça Sorulan Sorular',
    faqs: [
      ['PN Parfüm bayisi nasıl olunur?', 'Bu sayfadaki formu mağaza/işletme bilgileriniz, şehriniz ve ilgilendiğiniz serilerle doldurmanız yeterli. Ekibimiz başvurunuzu değerlendirip sizinle iletişime geçer.'],
      ['Bayilik ile distribütörlük arasındaki fark nedir?', 'Bayilik, ürünleri kendi mağazanızda veya online kanalınızda satmak içindir. Distribütörlük ise bir ülke ya da şehirde birden fazla satış noktasına ürün sağlayan daha geniş bir iş modelidir; ayrı bir başvuru sayfası vardır.'],
      ['Bayilik franchise ya da mağaza açma desteği içerir mi?', 'Hayır. Bayilik, ürünlerin toptan alınıp sizin işletmenizde satılması esasına dayanır; franchise veya mağaza açma desteği sunulmaz.'],
      ['Fiyat ve minimum sipariş adedi nedir?', 'Fiyat, adet ve sözleşme koşulları başvuru değerlendirildikten sonra birlikte görüşülür.'],
    ],
  },
  en: {
    eyebrow: 'Dealership',
    h: 'Become a PN Parfüm Dealer',
    lead: 'Offer PN Parfüm products in your own store or online sales channel. From a small shop to a big story: watch the film, fill in the form and our team will get in touch.',
    cta: 'Go to the Dealership Form',
    heroAlt: 'An elegant small perfume shop with a PN Parfume sign and shelves of PN perfume boxes',
    filmT: 'A dealership story',
    filmP: 'Watch a story that starts in a small shop and see briefly how a dealership journey can begin.',
    whyT: 'Why become a PN Parfüm dealer?',
    why: [
      ['Lines for every budget', 'Six brands and lines, from affordable everyday lines to luxury collections.'],
      ['Directly from the manufacturer', 'You work with a brand that produces at its own head office and laboratory in Silivri, İstanbul.'],
      ['24 years of experience', 'Producing since 2002, with established brands as a solid base for a partnership.'],
      ['Sales-ready presentation', 'Talk to our team about visual and content support to help you promote the products.'],
    ],
    stepsT: 'How dealership works',
    steps: [
      ['Fill in the form', 'Share your store/business, city and the lines you are interested in.'],
      ['Our team reviews it', 'Your application is reviewed for location and business structure.'],
      ['Let’s talk', 'For suitable applications, products and terms are discussed together.'],
    ],
    notT: 'Important',
    not: 'A dealership application is a preliminary request; prices, minimum quantities and contract terms are discussed after the review. Dealership means buying products wholesale and selling them in your own business; it does not include a franchise or store-opening support.',
    diffT: 'Do you want to represent a whole country or region?',
    diff: 'For a model in which you supply several points of sale in a country or city, see our Distributor page.',
    diffCta: 'Distributor application',
    diffHref: '/en/distributor',
    formT: 'Dealership Application Form',
    formP: 'Tell us about your business and the lines you are interested in.',
    faqT: 'Frequently Asked Questions',
    faqs: [
      ['How do I become a PN Parfüm dealer?', 'Fill in the form on this page with your store or business details, city and the lines you are interested in. Our team reviews your application and contacts you.'],
      ['What is the difference between a dealer and a distributor?', 'A dealer sells the products in their own store or online channel. A distributor supplies several points of sale in a country or city, which is a broader model with its own application page.'],
      ['Does dealership include a franchise or store-opening support?', 'No. Dealership means buying products wholesale and selling them in your own business; no franchise or store-opening support is offered.'],
      ['What are the prices and minimum order quantities?', 'Prices, quantities and contract terms are discussed together once the application has been reviewed.'],
    ],
  },
  ar: {
    eyebrow: 'الوكالة',
    h: 'كن وكيل PN Parfüm',
    lead: 'اعرض منتجات PN Parfüm في متجرك أو قناة بيعك عبر الإنترنت. من متجر صغير إلى قصة كبيرة: شاهد الفيلم واملأ النموذج وسيتواصل معك فريقنا.',
    cta: 'انتقل إلى نموذج الوكالة',
    heroAlt: 'متجر عطور صغير أنيق بلافتة PN Parfume ورفوف تحمل علب عطور PN',
    filmT: 'قصة وكالة',
    filmP: 'شاهد قصة تبدأ من متجر صغير وتعرّف باختصار على كيف يمكن أن تبدأ رحلة الوكالة.',
    whyT: 'لماذا تصبح وكيل PN Parfüm؟',
    why: [
      ['سلاسل لكل ميزانية', 'ست علامات وسلاسل، من السلاسل الاقتصادية اليومية إلى المجموعات الفاخرة.'],
      ['مباشرة من المصنّع', 'تتعامل مع علامة تنتج في مقرها الرئيسي ومختبرها في سيليفري بإسطنبول.'],
      ['خبرة 24 عامًا', 'ننتج منذ عام 2002، وعلاماتنا الراسخة تمنحك أساسًا متينًا للشراكة.'],
      ['عرض جاهز للبيع', 'تحدث مع فريقنا حول الدعم بالصور والمحتوى للترويج للمنتجات.'],
    ],
    stepsT: 'مراحل الوكالة',
    steps: [
      ['املأ النموذج', 'شاركنا بيانات متجرك أو نشاطك ومدينتك والسلاسل التي تهمك.'],
      ['يراجعه فريقنا', 'تتم مراجعة طلبك من حيث الموقع وهيكل النشاط.'],
      ['لنتحدث', 'في الطلبات المناسبة، تُناقش المنتجات والشروط معًا.'],
    ],
    notT: 'معلومة مهمة',
    not: 'طلب الوكالة هو طلب أولي؛ تُناقش الأسعار والحد الأدنى للكميات وشروط العقد بعد المراجعة. تقوم الوكالة على شراء المنتجات بالجملة وبيعها في نشاطك الخاص، ولا تتضمن امتيازًا تجاريًا (فرنشايز) أو دعمًا لافتتاح المتاجر.',
    diffT: 'هل تريد تمثيل دولة أو منطقة كاملة؟',
    diff: 'لنموذج تزوّد فيه عدة نقاط بيع في دولة أو مدينة، اطلع على صفحة الموزّعين لدينا.',
    diffCta: 'طلب التوزيع',
    diffHref: '/ar/distributor',
    formT: 'نموذج طلب الوكالة',
    formP: 'حدّثنا عن نشاطك والسلاسل التي تهمك.',
    faqT: 'الأسئلة الشائعة',
    faqs: [
      ['كيف أصبح وكيل PN Parfüm؟', 'املأ النموذج في هذه الصفحة ببيانات متجرك أو نشاطك ومدينتك والسلاسل التي تهمك. يراجع فريقنا طلبك ويتواصل معك.'],
      ['ما الفرق بين الوكيل والموزّع؟', 'الوكيل يبيع المنتجات في متجره أو قناته عبر الإنترنت. أما الموزّع فيزوّد عدة نقاط بيع في دولة أو مدينة، وهو نموذج أوسع له صفحة طلب مستقلة.'],
      ['هل تتضمن الوكالة امتيازًا تجاريًا أو دعمًا لافتتاح المتاجر؟', 'لا. تقوم الوكالة على شراء المنتجات بالجملة وبيعها في نشاطك الخاص، ولا يُقدَّم امتياز تجاري أو دعم لافتتاح المتاجر.'],
      ['ما الأسعار والحد الأدنى للطلب؟', 'تُناقش الأسعار والكميات وشروط العقد معًا بعد مراجعة الطلب.'],
    ],
  },
} as const

export function dealershipJsonLd(locale: Locale, url: string) {
  const c = DEALERSHIP[locale]
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale,
      mainEntity: c.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: c.h,
      url,
      inLanguage: locale,
      about: { '@type': 'Service', serviceType: 'Perfume dealership partnership' },
      isPartOf: { '@type': 'WebSite', name: 'PN Parfüm', url: 'https://pnparfume.com' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: locale === 'tr' ? 'PN Parfüm bayilik tanıtım filmi' : locale === 'en' ? 'PN Parfüm dealership promo film' : 'فيلم ترويجي لوكلاء PN Parfüm',
      description: c.filmP,
      inLanguage: locale,
      thumbnailUrl: 'https://pnparfume.com/kurumsal/pien-bayilik-poster.jpg',
      contentUrl: `https://pnparfume.com/kurumsal/pien-bayilik-${locale}.mp4`,
      uploadDate: '2026-11-19',
      duration: 'PT40S',
    },
  ]
}

export default function DealershipContent({ locale = 'tr' }: { locale?: Locale }) {
  const c = DEALERSHIP[locale]
  const p = `deal-${locale}`
  const rtl = 'rtl:tracking-normal rtl:normal-case'

  return (
    <div className="space-y-16" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <section aria-labelledby={`${p}-hero`} className="relative overflow-hidden rounded-3xl">
        <div className="relative min-h-[480px] w-full sm:min-h-[400px]">
          <Image src="/kurumsal/bayilik-hero-v3.jpg" alt={c.heroAlt} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
          <div className={`absolute inset-0 ${locale === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-black/80 via-black/50 to-black/5`} aria-hidden="true" />
          <div className="absolute inset-0 bg-black/35 sm:hidden" aria-hidden="true" />
          <div className="relative flex min-h-[480px] flex-col justify-center gap-4 p-6 sm:min-h-[400px] sm:p-10 md:max-w-[70%]">
            <p className={`text-xs font-medium uppercase tracking-[0.25em] text-[#d9b98a] ${rtl}`}>{c.eyebrow}</p>
            <h2 id={`${p}-hero`} className="text-3xl font-light leading-tight text-white sm:text-4xl">{c.h}</h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">{c.lead}</p>
            <div>
              <a href={`#${p}-form`} className="inline-block rounded-full bg-[#d9b98a] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white">{c.cta}</a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby={`${p}-film`} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <h3 id={`${p}-film`} className="text-2xl font-light">{c.filmT}</h3>
          <p className="text-sm leading-relaxed text-foreground/65">{c.filmP}</p>
        </div>
        <DealerFilm locale={locale} />
      </section>

      <section aria-labelledby={`${p}-why`} className="space-y-6">
        <h3 id={`${p}-why`} className="text-2xl font-light">{c.whyT}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.why.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-foreground/10 bg-background p-6">
              <h4 className="mb-2 font-medium text-foreground">{t}</h4>
              <p className="text-sm leading-relaxed text-foreground/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby={`${p}-steps`} className="space-y-6">
        <h3 id={`${p}-steps`} className="text-2xl font-light">{c.stepsT}</h3>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {c.steps.map(([t, d], i) => (
            <li key={t} className="flex items-start gap-4 rounded-2xl border border-foreground/10 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/60 font-light text-accent-gold">{i + 1}</span>
              <div>
                <p className="font-medium text-foreground">{t}</p>
                <p className="text-sm text-foreground/60">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5">
          <p className="mb-1 text-sm font-medium text-foreground">{c.notT}</p>
          <p className="text-xs leading-relaxed text-foreground/65">{c.not}</p>
        </div>
      </section>

      <section id={`${p}-form`} aria-labelledby={`${p}-formh`} className="rounded-3xl border border-foreground/10 bg-background p-6 md:p-10">
        <h3 id={`${p}-formh`} className="mb-2 text-2xl font-light">{c.formT}</h3>
        <p className="mb-8 text-sm text-foreground/60">{c.formP}</p>
        <DealershipForm locale={locale} />
      </section>

      <section className="rounded-2xl border border-foreground/10 p-6">
        <h3 className="mb-2 text-lg font-medium">{c.diffT}</h3>
        <p className="mb-4 text-sm text-foreground/65">{c.diff}</p>
        <Link href={c.diffHref} className="inline-block rounded-full border border-accent-gold px-5 py-2 text-sm text-accent-gold transition-colors hover:bg-accent-gold hover:text-background">
          {c.diffCta}
        </Link>
      </section>

      <section aria-labelledby={`${p}-faq`} className="space-y-3">
        <h3 id={`${p}-faq`} className="text-2xl font-light">{c.faqT}</h3>
        {c.faqs.map(([q, a]) => (
          <details key={q} className="rounded-2xl border border-foreground/10 p-5">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">{a}</p>
          </details>
        ))}
      </section>
    </div>
  )
}
