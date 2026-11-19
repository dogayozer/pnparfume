'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

type Locale = 'tr' | 'en' | 'ar'

const input =
  'w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold transition-colors'
const label = 'block text-xs font-medium uppercase tracking-widest rtl:tracking-normal rtl:normal-case text-foreground/50 mb-2'

// Seçenek DEĞERLERİ (sunucuya giden) her dilde aynı Türkçe sabitler; yalnızca etiketler dile göre.
const TYPE_VALUES = ['Parfüm/kozmetik mağazası', 'Perakende/market', 'E-ticaret', 'Pazaryeri satıcısı', 'Kuaför/güzellik merkezi', 'Diğer'] as const
const CHANNEL_VALUES = ['Fiziki mağaza', 'Online', 'Hem fiziki hem online', 'Henüz yok, başlayacağım'] as const
const SERIES = ['Pien Serisi', 'Pien Intense', 'Aşık Parfüm', 'Pien Luxury', 'PN', 'PN Özel Seri'] as const

const T = {
  tr: {
    aria: 'Bayilik başvuru formu',
    shop: 'Mağaza / Firma Adı', contact: 'Yetkili Kişi', email: 'E-posta', phone: 'Telefon / WhatsApp',
    country: 'Ülke', city: 'Şehir / İlçe', select: 'Seçiniz',
    type: 'İşletme türü', types: ['Parfüm / kozmetik mağazası', 'Perakende / market', 'E-ticaret', 'Pazaryeri satıcısı', 'Kuaför / güzellik merkezi', 'Diğer'],
    channel: 'Satış kanalınız', channels: ['Fiziki mağaza', 'Online', 'Hem fiziki hem online', 'Henüz yok, başlayacağım'],
    interests: 'İlgilendiğiniz seriler', msg: 'Mesajınız', msgPh: 'İşletmenizden ve beklentilerinizden kısaca bahsedin.',
    honey: 'Bu alanı boş bırakın',
    consent: 'İletişim bilgilerimin, talebimin değerlendirilmesi amacıyla PN Parfüm tarafından kullanılmasını kabul ediyorum. *',
    submit: 'Bayilik Talebini Gönder', note: 'Talebiniz incelendikten sonra ekibimiz sizinle iletişime geçecektir.',
    ok: 'Bayilik talebiniz alındı. Ekibimiz değerlendirip sizinle iletişime geçecek.',
    err: 'Bir hata oluştu.', net: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
  },
  en: {
    aria: 'Dealership application form',
    shop: 'Shop / Company Name', contact: 'Contact Person', email: 'Email', phone: 'Phone / WhatsApp',
    country: 'Country', city: 'City / District', select: 'Select',
    type: 'Business type', types: ['Perfume / cosmetics store', 'Retail / supermarket', 'E-commerce', 'Marketplace seller', 'Hair / beauty salon', 'Other'],
    channel: 'Your sales channel', channels: ['Physical store', 'Online', 'Both physical and online', 'None yet, I am starting'],
    interests: 'Lines you are interested in', msg: 'Your Message', msgPh: 'Tell us briefly about your business and expectations.',
    honey: 'Leave this field empty',
    consent: 'I agree that my contact details may be used by PN Parfüm to evaluate my request. *',
    submit: 'Submit Dealership Request', note: 'After reviewing your request, our team will contact you.',
    ok: 'Your dealership request has been received. Our team will review it and contact you.',
    err: 'Something went wrong.', net: 'A connection error occurred. Please try again.',
  },
  ar: {
    aria: 'نموذج طلب الوكالة',
    shop: 'اسم المتجر / الشركة', contact: 'الشخص المسؤول', email: 'البريد الإلكتروني', phone: 'الهاتف / واتساب',
    country: 'الدولة', city: 'المدينة / الحي', select: 'اختر',
    type: 'نوع النشاط', types: ['متجر عطور / مستحضرات تجميل', 'تجزئة / سوبرماركت', 'تجارة إلكترونية', 'بائع على منصة تسوق', 'صالون تجميل / حلاقة', 'أخرى'],
    channel: 'قناة البيع لديكم', channels: ['متجر فعلي', 'عبر الإنترنت', 'متجر فعلي وعبر الإنترنت', 'لا يوجد بعد، سأبدأ'],
    interests: 'السلاسل التي تهمكم', msg: 'رسالتكم', msgPh: 'حدّثونا باختصار عن نشاطكم وتوقعاتكم.',
    honey: 'اترك هذا الحقل فارغًا',
    consent: 'أوافق على استخدام بيانات التواصل الخاصة بي من قِبل PN Parfüm لغرض تقييم طلبي. *',
    submit: 'إرسال طلب الوكالة', note: 'بعد مراجعة طلبكم، سيتواصل معكم فريقنا.',
    ok: 'تم استلام طلب الوكالة. سيراجعه فريقنا ويتواصل معكم.',
    err: 'حدث خطأ ما.', net: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
  },
} as const

const EMPTY = {
  shopName: '', contactName: '', email: '', phone: '', country: '', city: '',
  businessType: '', salesChannel: '', interests: [] as string[], message: '', website2: '', consent: false,
}

export default function DealershipForm({ locale = 'tr' }: { locale?: Locale }) {
  const t = T[locale]
  const [f, setF] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const set =
    (k: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value })

  const toggleSeries = (s: string) =>
    setF({ ...f, interests: f.interests.includes(s) ? f.interests.filter((x) => x !== s) : [...f.interests, s] })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/contact/dealership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, locale }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: t.ok })
        setF(EMPTY)
      } else {
        setStatus({ type: 'error', message: data.error || t.err })
      }
    } catch {
      setStatus({ type: 'error', message: t.net })
    } finally {
      setLoading(false)
    }
  }

  const id = (s: string) => `b-${locale}-${s}`

  return (
    <form onSubmit={submit} className="space-y-6" aria-label={t.aria} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {status && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-medium ${
            status.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={20} /> : <AlertCircle className="mt-0.5 shrink-0" size={20} />}
          <p>{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={label} htmlFor={id('shop')}>{t.shop} *</label>
          <input id={id('shop')} required className={input} value={f.shopName} onChange={set('shopName')} />
        </div>
        <div>
          <label className={label} htmlFor={id('contact')}>{t.contact} *</label>
          <input id={id('contact')} required className={input} value={f.contactName} onChange={set('contactName')} />
        </div>
        <div>
          <label className={label} htmlFor={id('email')}>{t.email} *</label>
          <input id={id('email')} type="email" dir="ltr" required className={input} value={f.email} onChange={set('email')} placeholder="name@company.com" />
        </div>
        <div>
          <label className={label} htmlFor={id('phone')}>{t.phone} *</label>
          <input id={id('phone')} type="tel" dir="ltr" required className={input} value={f.phone} onChange={set('phone')} placeholder="+90 5XX XXX XX XX" />
        </div>
        <div>
          <label className={label} htmlFor={id('country')}>{t.country}</label>
          <input id={id('country')} className={input} value={f.country} onChange={set('country')} />
        </div>
        <div>
          <label className={label} htmlFor={id('city')}>{t.city} *</label>
          <input id={id('city')} required className={input} value={f.city} onChange={set('city')} />
        </div>
        <div>
          <label className={label} htmlFor={id('type')}>{t.type} *</label>
          <select id={id('type')} required className={input} value={f.businessType} onChange={set('businessType')}>
            <option value="">{t.select}</option>
            {t.types.map((o, i) => <option key={o} value={TYPE_VALUES[i]}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor={id('channel')}>{t.channel} *</label>
          <select id={id('channel')} required className={input} value={f.salesChannel} onChange={set('salesChannel')}>
            <option value="">{t.select}</option>
            {t.channels.map((o, i) => <option key={o} value={CHANNEL_VALUES[i]}>{o}</option>)}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={label}>{t.interests}</legend>
        <div className="flex flex-wrap gap-2">
          {SERIES.map((s) => {
            const on = f.interests.includes(s)
            return (
              <label
                key={s}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  on ? 'border-accent-gold bg-accent-gold/10 text-accent-gold' : 'border-foreground/15 text-foreground/65 hover:border-accent-gold/60'
                }`}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleSeries(s)} />
                {s}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label className={label} htmlFor={id('msg')}>{t.msg}</label>
        <textarea id={id('msg')} rows={4} className={`${input} resize-none`} value={f.message} onChange={set('message')} placeholder={t.msgPh} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={id('honey')}>{t.honey}</label>
        <input id={id('honey')} tabIndex={-1} autoComplete="off" value={f.website2} onChange={set('website2')} />
      </div>

      <label className="flex items-start gap-3 text-xs text-foreground/60">
        <input type="checkbox" required checked={f.consent} onChange={set('consent')} className="mt-0.5" />
        <span>{t.consent}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex min-w-[240px] items-center justify-center rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-gold disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : t.submit}
      </button>
      <p className="text-xs text-foreground/40">{t.note}</p>
    </form>
  )
}
