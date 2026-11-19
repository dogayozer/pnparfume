import Image from 'next/image'

type Locale = 'en' | 'ar'

export const ABOUT = {
  en: {
    eyebrow: 'Producing since 2002',
    h: 'About PN Parfüm',
    quote: '“Scent is an invisible key that opens the deepest rooms of memory. For us, a perfume is more than a blend of essences: it is a hypnotic architecture of feeling that lives on your skin, wraps around you and breathes with you all day.”',
    p1: 'At the heart of the PN Parfüm philosophy is a passion for exceeding expectations. We blend more than two decades of production heritage with modern neuro-perfumery, turning an ordinary habit into a unique ritual. Every drop we put into our bottles reflects our promise of longevity and consistency.',
    stats: [['2002', 'producing since'], ['24', 'years of experience'], ['400', 'fragrance options'], ['6', 'brands and product lines']],
    trustT: 'Transparency and Sustainable Craft',
    trust1: 'We do not just design fragrances; we build an ecosystem of trust that respects nature, people and technical safety. In our laboratories we bring together fine natural extracts and innovative fragrance molecules.',
    trust2: 'This craft is filtered through the strict standards of IFRA (the International Fragrance Association) and EU cosmetics regulations. Our integrated management approach, focused on informing consumers and protecting the planet, reflects our belief in sustainable excellence.',
    globalT: 'A Frequency Beyond Borders: Our Global Ecosystem',
    global: 'The invisible signature we created has grown into a frequency that reaches beyond borders. Today, through our dealer and distributor network in Türkiye and abroad, including Europe, we touch lives in many places, and we welcome partners who want to join this ecosystem as distributors.',
    goal: 'Our aim is to bring this world-class fragrance experience to people, without compromising quality, with the “right note” that wraps the soul in perfect harmony.',
    imgAlt: 'Scent library in the PN Parfüm laboratory with hundreds of amber fragrance bottles',
    ctaT: 'Work with us',
    cta1: ['Become a distributor', '/en/distributor'],
    cta2: ['Create your own brand', '/en/private-label'],
    cta3: ['Contact us', '/en/contact'],
  },
  ar: {
    eyebrow: 'ننتج منذ عام 2002',
    h: 'عن PN Parfüm',
    quote: '«العطر مفتاح خفي يفتح أعمق غرف الذاكرة. والعطر بالنسبة لنا ليس مجرد مزيج من الخلاصات، بل هو عمارة شعورية آسرة تعيش على بشرتك وتحيط بك وتتنفس معك طوال اليوم.»',
    p1: 'في قلب فلسفة PN Parfüm شغفٌ بتجاوز التوقعات. نمزج إرث إنتاج يزيد على عقدين مع علم العطور العصبي الحديث، لنحوّل عادة مألوفة إلى طقس فريد. كل قطرة نضعها في زجاجاتنا تعكس وعدنا بالثبات والاتساق.',
    stats: [['2002', 'ننتج منذ'], ['24', 'عامًا من الخبرة'], ['400', 'خيار عطري'], ['6', 'علامات وسلاسل منتجات']],
    trustT: 'الشفافية والصنعة المستدامة',
    trust1: 'نحن لا نصمم العطور فحسب، بل نبني منظومة ثقة تحترم الطبيعة والإنسان والسلامة التقنية. في مختبراتنا نجمع بين خلاصات طبيعية راقية وجزيئات عطرية مبتكرة.',
    trust2: 'تمر هذه الصنعة عبر معايير صارمة للرابطة الدولية للعطور (IFRA) ولوائح مستحضرات التجميل الأوروبية. ويعكس نهجنا الإداري المتكامل، الذي يركز على توعية المستهلك وحماية كوكبنا، إيماننا بالتميز المستدام.',
    globalT: 'تردد يتجاوز الحدود: منظومتنا العالمية',
    global: 'تحوّل توقيعنا الخفي إلى تردد يتجاوز الحدود. واليوم، عبر شبكة وكلائنا وموزعينا داخل تركيا وخارجها، بما في ذلك أوروبا، نلامس أرواحًا في أماكن كثيرة، ونرحب بالشركاء الراغبين في الانضمام إلى هذه المنظومة كموزعين.',
    goal: 'هدفنا أن نقدّم تجربة العطر العالمية هذه للناس دون التنازل عن الجودة، مع «النوتة الصحيحة» التي تحتضن الروح بانسجام تام.',
    imgAlt: 'مكتبة عطور في مختبر PN Parfüm تضم مئات زجاجات العطر الكهرمانية',
    ctaT: 'اعمل معنا',
    cta1: ['كن موزّعًا', '/ar/distributor'],
    cta2: ['أنشئ علامتك الخاصة', '/ar/private-label'],
    cta3: ['اتصل بنا', '/ar/contact'],
  },
} as const

export default function AboutContent({ locale }: { locale: Locale }) {
  const c = ABOUT[locale]
  const rtl = 'rtl:tracking-normal rtl:normal-case'

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="space-y-14">
      <div className="space-y-4">
        <p className={`text-xs font-medium uppercase tracking-[0.25em] text-accent-gold ${rtl}`}>{c.eyebrow}</p>
        <h2 className="text-3xl font-light text-accent-gold">{c.h}</h2>
        <p className="max-w-3xl text-lg font-medium italic text-foreground">{c.quote}</p>
        <p className="max-w-3xl leading-relaxed text-foreground/70">{c.p1}</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {c.stats.map(([n, l]) => (
          <div key={n + l} className="rounded-2xl border border-foreground/10 bg-background p-5 text-center">
            <dt className="font-serif text-3xl font-light text-accent-gold">{n}</dt>
            <dd className="mt-1 text-xs text-foreground/60">{l}</dd>
          </div>
        ))}
      </dl>

      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-foreground/10">
          <Image src="/kurumsal/koku-kutuphane.jpg" alt={c.imgAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-light">{c.trustT}</h3>
          <p className="text-sm leading-relaxed text-foreground/70">{c.trust1}</p>
          <p className="text-sm leading-relaxed text-foreground/70">{c.trust2}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl font-light">{c.globalT}</h3>
        <p className="max-w-3xl leading-relaxed text-foreground/70">{c.global}</p>
        <p className="max-w-3xl text-lg font-medium text-accent-gold">{c.goal}</p>
      </section>

      <section className="space-y-4 border-t border-foreground/10 pt-10">
        <h3 className="text-2xl font-light">{c.ctaT}</h3>
        <div className="flex flex-wrap gap-3">
          {[c.cta1, c.cta2, c.cta3].map(([label, href]) => (
            <a key={href} href={href} className="rounded-full border border-accent-gold px-6 py-3 text-sm font-medium text-accent-gold transition-colors hover:bg-accent-gold hover:text-background">
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
