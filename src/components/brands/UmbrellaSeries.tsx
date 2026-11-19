import Image from 'next/image'
import Link from 'next/link'

type Locale = 'tr' | 'en' | 'ar'

const CONTENT = {
  tr: {
    eyebrow: 'PN Çatısı Altında Özel Seri',
    heading: 'Kendi Markanı Kurmadan, PN Çatısı Altında Kendi Serini Üret',
    intro:
      'Her girişimcinin hemen kendi marka sürecine girmesi gerekmez. PN markasının çatısı altında, size özel bir alt marka serisi üretebilir; maliyetinizi kısabilir ve yüksek üretim adedi sınırlarından kaçınabilirsiniz.',
    benefits: [
      { t: 'Daha düşük maliyet', d: 'Kendi marka süreçlerinin yükünü beklemeden, yerleşik PN çatısı altında başlarsınız.' },
      { t: 'Daha esnek üretim adedi', d: 'Kendi markanızla üretimde karşılaşılan yüksek adet sınırlarından kaçınabilirsiniz.' },
      { t: 'Hazır güven', d: '24 yıllık tecrübe ve var olan PN markasının altyapısıyla yola çıkarsınız.' },
      { t: 'Size özel kimlik', d: 'Kendi seri adınız, renginiz ve kutunuzla "A PN SERIES" olarak sunulursunuz.' },
    ],
    exampleTitle: 'Örnek seriler',
    exampleNote: 'MIX ve AGORA, PN çatısı altında oluşturulabilecek alt marka serilerine örnek tasarımlardır.',
    lineupAlt: 'PN çatısı altında NUDE, AURA, ALFA, MIX ve AGORA parfüm kutuları yan yana',
    deskAlt: 'Girişimci PN kutu maketi ve renk örnekleriyle kendi serisini seçiyor',
    agoraAlt: 'AGORA: PN çatısı altında zümrüt yeşili örnek seri kutusu',
    mixAlt: 'MIX: PN çatısı altında grafit siyahı örnek seri kutusu',
    note: 'Kapsam, adet ve koşullar projeye göre birlikte belirlenir.',
    cta: 'Seri Fikrini Bizimle Paylaş',
    ctaHref: '/kurumsal/girisimcilere-ozel',
  },
  en: {
    eyebrow: 'Your Own Series Under the PN Umbrella',
    heading: 'Create Your Own Series Under PN, Without Building a Brand First',
    intro:
      'Not every entrepreneur needs to start their own brand process right away. Under the PN brand umbrella you can launch a sub-brand series of your own, cut your costs and avoid the high production quantity limits of an independent brand.',
    benefits: [
      { t: 'Lower cost', d: 'You start under the established PN umbrella without taking on the burden of building your own brand first.' },
      { t: 'More flexible quantities', d: 'You can avoid the high minimum quantities that come with producing under your own brand.' },
      { t: 'Ready-made trust', d: 'You set out with 24 years of experience and the infrastructure of the existing PN brand.' },
      { t: 'Your own identity', d: 'Your own series name, colour and box, presented as "A PN SERIES".' },
    ],
    exampleTitle: 'Example series',
    exampleNote: 'MIX and AGORA are example designs of the sub-brand series that can be created under the PN umbrella.',
    lineupAlt: 'NUDE, AURA, ALFA, MIX and AGORA perfume boxes side by side under the PN umbrella',
    deskAlt: 'An entrepreneur choosing their own series with PN box mock-ups and colour swatches',
    agoraAlt: 'AGORA: an example emerald green series box under the PN umbrella',
    mixAlt: 'MIX: an example graphite black series box under the PN umbrella',
    note: 'Scope, quantities and terms are agreed per project.',
    cta: 'Share Your Series Idea',
    ctaHref: '/en/private-label',
  },
  ar: {
    eyebrow: 'سلسلتك الخاصة تحت مظلة PN',
    heading: 'أنشئ سلسلتك الخاصة تحت مظلة PN دون الحاجة لبناء علامة أولاً',
    intro:
      'ليس على كل رائد أعمال أن يبدأ مسار علامته الخاصة فورًا. تحت مظلة علامة PN يمكنك إطلاق سلسلة علامة فرعية خاصة بك، وتقليل تكاليفك وتجنب حدود الكميات العالية للإنتاج المستقل.',
    benefits: [
      { t: 'تكلفة أقل', d: 'تبدأ تحت مظلة PN الراسخة دون عبء بناء علامتك الخاصة أولًا.' },
      { t: 'كميات إنتاج أكثر مرونة', d: 'يمكنك تجنب الحدود الدنيا العالية للكميات المرتبطة بالإنتاج تحت علامتك الخاصة.' },
      { t: 'ثقة جاهزة', d: 'تنطلق بخبرة 24 عامًا وبنية علامة PN القائمة.' },
      { t: 'هوية خاصة بك', d: 'اسم سلسلتك ولونها وعلبتك الخاصة، تُقدَّم بعبارة "A PN SERIES".' },
    ],
    exampleTitle: 'سلاسل نموذجية',
    exampleNote: 'MIX وAGORA تصاميم نموذجية لسلاسل العلامات الفرعية التي يمكن إنشاؤها تحت مظلة PN.',
    lineupAlt: 'علب عطور NUDE وAURA وALFA وMIX وAGORA جنبًا إلى جنب تحت مظلة PN',
    deskAlt: 'رائد أعمال يختار سلسلته الخاصة بنماذج علب PN وعينات الألوان',
    agoraAlt: 'AGORA: علبة سلسلة نموذجية بلون أخضر زمردي تحت مظلة PN',
    mixAlt: 'MIX: علبة سلسلة نموذجية بلون الجرافيت تحت مظلة PN',
    note: 'يتم الاتفاق على النطاق والكميات والشروط حسب المشروع.',
    cta: 'شاركنا فكرة سلسلتك',
    ctaHref: '/ar/private-label',
  },
} as const

export default function UmbrellaSeries({ locale = 'tr' }: { locale?: Locale }) {
  const c = CONTENT[locale]
  const id = `umbrella-heading-${locale}`

  return (
    <section aria-labelledby={id} className="space-y-10" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] rtl:normal-case rtl:tracking-normal text-accent-gold">
          {c.eyebrow}
        </p>
        <h2 id={id} className="text-3xl font-light text-foreground">
          {c.heading}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">{c.intro}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-foreground/10">
          <Image
            src="/markalar/cati-tasarim.jpg"
            alt={c.deskAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.benefits.map((b) => (
            <li key={b.t} className="rounded-2xl border border-foreground/10 bg-background p-5">
              <h3 className="mb-1 font-medium text-foreground">{b.t}</h3>
              <p className="text-sm leading-relaxed text-foreground/65">{b.d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-foreground/10">
        <Image
          src="/markalar/cati-dizilim.jpg"
          alt={c.lineupAlt}
          fill
          sizes="(min-width: 1024px) 900px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-light text-foreground">{c.exampleTitle}</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src="/markalar/cati-agora.jpg"
              alt={c.agoraAlt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src="/markalar/cati-mix.jpg"
              alt={c.mixAlt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <p className="text-xs text-foreground/50">{c.exampleNote}</p>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-foreground/50">{c.note}</p>
        <Link
          href={c.ctaHref}
          className="inline-block rounded-full border border-accent-gold px-6 py-3 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold hover:text-background"
        >
          {c.cta}
        </Link>
      </div>
    </section>
  )
}
