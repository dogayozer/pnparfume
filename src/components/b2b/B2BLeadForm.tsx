'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

// Çok adımlı B2B lead formu — Bölüm 3.4'teki (claudeparfumithalat.md) önerilen
// yapı: Adım 1 düşük sürtünmeli tek tık (iş modeli), sonra iletişim/hacim bilgileri.
// `defaultInterest`, hangi sayfadan (wholesale/private-label) geldiğine göre
// Adım 1'i önceden seçili gösterir ama kullanıcı değiştirebilir.
// `lang` sayfanın dilini belirler (varsayılan İngilizce — mevcut /en/* sayfaları
// bozulmasın diye); Türkçe sayfalar (ör. /kendi-parfum-markani-yarat) 'tr' geçer.
const STRINGS = {
  en: {
    heading: 'Request a Quote', step: 'Step', of: 'of',
    interestPrompt: 'What are you looking for?',
    distributorLabel: 'I want to become a distributor', distributorDesc: 'Wholesale purchasing, resell under our brand',
    privateLabelLabel: 'I want to create my own brand', privateLabelDesc: 'Private label — your own brand, our production',
    country: 'Country', countryPh: 'e.g. North Macedonia',
    companyName: 'Company Name', companyNamePh: 'Your company name',
    contactName: 'Your Name', contactNamePh: 'Full name',
    back: 'Back', continueLabel: 'Continue',
    email: 'Business Email', emailPh: 'you@company.com',
    whatsapp: 'WhatsApp / Phone', whatsappPh: '+...',
    website: 'Website (optional)', websitePh: 'https://...',
    volume: 'Estimated Monthly Volume', selectPlaceholder: 'Select...',
    volOpts: [['<500', 'Under 500 units'], ['500-2000', '500 – 2,000 units'], ['2000-10000', '2,000 – 10,000 units'], ['10000+', '10,000+ units']] as [string, string][],
    currentActivity: 'Current Business',
    activityOpts: [['Retail', 'Retail'], ['Wholesale', 'Wholesale'], ['New startup', 'New startup']] as [string, string][],
    message: 'Message', messagePh: "Tell us a bit about your business and what you're looking for...",
    submit: 'Submit Request',
    successMsg: 'Thank you — your request has been received. Our team will contact you shortly.',
    genericError: 'Something went wrong.', networkError: 'Something went wrong while sending your request.',
  },
  tr: {
    heading: 'Teklif Talep Edin', step: 'Adım', of: '/',
    interestPrompt: 'Ne arıyorsunuz?',
    distributorLabel: 'Distribütör olmak istiyorum', distributorDesc: 'Toptan alım, markamız altında satış',
    privateLabelLabel: 'Kendi markamı yaratmak istiyorum', privateLabelDesc: 'Private label — kendi markanız, bizim üretimimiz',
    country: 'Ülke', countryPh: 'ör. Kuzey Makedonya',
    companyName: 'Firma Adı', companyNamePh: 'Firmanızın adı',
    contactName: 'Adınız Soyadınız', contactNamePh: 'Ad Soyad',
    back: 'Geri', continueLabel: 'Devam Et',
    email: 'İş E-postası', emailPh: 'siz@firma.com',
    whatsapp: 'WhatsApp / Telefon', whatsappPh: '+90...',
    website: 'Web Sitesi (opsiyonel)', websitePh: 'https://...',
    volume: 'Tahmini Aylık Hacim', selectPlaceholder: 'Seçiniz...',
    volOpts: [['<500', '500 adetten az'], ['500-2000', '500 – 2.000 adet'], ['2000-10000', '2.000 – 10.000 adet'], ['10000+', '10.000+ adet']] as [string, string][],
    currentActivity: 'Mevcut İş Durumunuz',
    activityOpts: [['Retail', 'Perakende'], ['Wholesale', 'Toptan'], ['New startup', 'Yeni girişim']] as [string, string][],
    message: 'Mesajınız', messagePh: 'İşinizden ve aradığınız şeyden kısaca bahsedin...',
    submit: 'Talebi Gönder',
    successMsg: 'Teşekkürler — talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.',
    genericError: 'Bir şeyler ters gitti.', networkError: 'Talebiniz gönderilirken bir hata oluştu.',
  },
  ar: {
    heading: 'اطلب عرض سعر', step: 'خطوة', of: 'من',
    interestPrompt: 'ماذا تبحثون عنه؟',
    distributorLabel: 'أريد أن أصبح موزعًا', distributorDesc: 'شراء بالجملة، إعادة بيع تحت علامتنا',
    privateLabelLabel: 'أريد إنشاء علامتي الخاصة', privateLabelDesc: 'تصنيع خاص (Private Label) — علامتكم، إنتاجنا',
    country: 'الدولة', countryPh: 'مثال: الإمارات العربية المتحدة',
    companyName: 'اسم الشركة', companyNamePh: 'اسم شركتكم',
    contactName: 'الاسم الكامل', contactNamePh: 'الاسم الكامل',
    back: 'رجوع', continueLabel: 'متابعة',
    email: 'البريد الإلكتروني للعمل', emailPh: 'you@company.com',
    whatsapp: 'واتساب / هاتف', whatsappPh: '+...',
    website: 'الموقع الإلكتروني (اختياري)', websitePh: 'https://...',
    volume: 'الحجم الشهري التقديري', selectPlaceholder: 'اختر...',
    volOpts: [['<500', 'أقل من 500 وحدة'], ['500-2000', '500 – 2,000 وحدة'], ['2000-10000', '2,000 – 10,000 وحدة'], ['10000+', 'أكثر من 10,000 وحدة']] as [string, string][],
    currentActivity: 'النشاط الحالي',
    activityOpts: [['Retail', 'تجزئة'], ['Wholesale', 'جملة'], ['New startup', 'شركة ناشئة جديدة']] as [string, string][],
    message: 'رسالتكم', messagePh: 'أخبرونا قليلاً عن عملكم وما تبحثون عنه...',
    submit: 'إرسال الطلب',
    successMsg: 'شكرًا لكم — تم استلام طلبكم. سيتواصل معكم فريقنا قريبًا.',
    genericError: 'حدث خطأ ما.', networkError: 'حدث خطأ أثناء إرسال طلبكم.',
  },
}

export default function B2BLeadForm({ defaultInterest, lang = 'en' }: { defaultInterest: 'Distributor' | 'Private Label'; lang?: 'en' | 'tr' | 'ar' }) {
  const t = STRINGS[lang]
  // RTL'de "geri" mantıksal olarak sağa, "devam" sola gider — ok ikonları buna göre ters çevrilir.
  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft
  const ContinueIcon = lang === 'ar' ? ArrowLeft : ArrowRight
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [formData, setFormData] = useState({
    interest: defaultInterest,
    country: '',
    companyName: '',
    contactName: '',
    email: '',
    whatsapp: '',
    website: '',
    volume: '',
    currentActivity: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const canContinueFromStep2 = formData.country.trim() && formData.companyName.trim() && formData.contactName.trim()
  const canContinueFromStep3 = formData.email.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus({ type: 'success', message: t.successMsg })
        setStep(5)
      } else {
        setStatus({ type: 'error', message: data.error || t.genericError })
      }
    } catch {
      setStatus({ type: 'error', message: t.networkError })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors"
  const labelClass = "block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2"

  return (
    <div className="border-t border-foreground/10 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-light">{t.heading}</h3>
        {step <= 4 && <span className="text-xs text-foreground/40">{t.step} {step} {t.of} 4</span>}
      </div>

      {status && step === 5 && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={20} /> : <AlertCircle className="shrink-0 mt-0.5" size={20} />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      {status?.type === 'error' && step !== 5 && (
        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 border bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-foreground/60 mb-2">{t.interestPrompt}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['Distributor', 'Private Label'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { setFormData({ ...formData, interest: opt }); setStep(2) }}
                className={`text-left p-5 rounded-2xl border transition-colors ${formData.interest === opt ? 'border-accent-gold bg-accent-gold/5' : 'border-foreground/10 hover:border-accent-gold/50'}`}
              >
                <span className="font-medium block mb-1">
                  {opt === 'Distributor' ? t.distributorLabel : t.privateLabelLabel}
                </span>
                <span className="text-xs text-foreground/50">
                  {opt === 'Distributor' ? t.distributorDesc : t.privateLabelDesc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t.country} *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required className={inputClass} placeholder={t.countryPh} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>{t.companyName} *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} placeholder={t.companyNamePh} />
            </div>
            <div>
              <label className={labelClass}>{t.contactName} *</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className={inputClass} placeholder={t.contactNamePh} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(1)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><BackIcon size={14} /> {t.back}</button>
            <button type="button" disabled={!canContinueFromStep2} onClick={() => setStep(3)} className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 flex items-center gap-2">
              {t.continueLabel} <ContinueIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>{t.email} *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder={t.emailPh} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>{t.whatsapp}</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} placeholder={t.whatsappPh} />
            </div>
            <div>
              <label className={labelClass}>{t.website}</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder={t.websitePh} />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(2)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><BackIcon size={14} /> {t.back}</button>
            <button type="button" disabled={!canContinueFromStep3} onClick={() => setStep(4)} className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 flex items-center gap-2">
              {t.continueLabel} <ContinueIcon size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>{t.volume}</label>
              <select name="volume" value={formData.volume} onChange={handleChange} className={inputClass}>
                <option value="">{t.selectPlaceholder}</option>
                {t.volOpts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.currentActivity}</label>
              <select name="currentActivity" value={formData.currentActivity} onChange={handleChange} className={inputClass}>
                <option value="">{t.selectPlaceholder}</option>
                {t.activityOpts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.message}</label>
            <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} placeholder={t.messagePh}></textarea>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(3)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><BackIcon size={14} /> {t.back}</button>
            <button type="submit" disabled={loading} className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[160px]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : t.submit}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
