'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

// Çok adımlı B2B lead formu — Bölüm 3.4'teki (claudeparfumithalat.md) önerilen
// yapı: Adım 1 düşük sürtünmeli tek tık (iş modeli), sonra iletişim/hacim bilgileri.
// `defaultInterest`, hangi sayfadan (wholesale/private-label) geldiğine göre
// Adım 1'i önceden seçili gösterir ama kullanıcı değiştirebilir.
export default function B2BLeadForm({ defaultInterest }: { defaultInterest: 'Distributor' | 'Private Label' }) {
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
        setStatus({ type: 'success', message: "Thank you — your request has been received. Our team will contact you shortly." })
        setStep(5)
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong while sending your request.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors"
  const labelClass = "block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2"

  return (
    <div className="border-t border-foreground/10 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-light">Request a Quote</h3>
        {step <= 4 && <span className="text-xs text-foreground/40">Step {step} of 4</span>}
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
          <p className="text-sm text-foreground/60 mb-2">What are you looking for?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['Distributor', 'Private Label'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { setFormData({ ...formData, interest: opt }); setStep(2) }}
                className={`text-left p-5 rounded-2xl border transition-colors ${formData.interest === opt ? 'border-accent-gold bg-accent-gold/5' : 'border-foreground/10 hover:border-accent-gold/50'}`}
              >
                <span className="font-medium block mb-1">
                  {opt === 'Distributor' ? 'I want to become a distributor' : 'I want to create my own brand'}
                </span>
                <span className="text-xs text-foreground/50">
                  {opt === 'Distributor' ? 'Wholesale purchasing, resell under our brand' : 'Private label — your own brand, our production'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required className={inputClass} placeholder="e.g. North Macedonia" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className={inputClass} placeholder="Your company name" />
            </div>
            <div>
              <label className={labelClass}>Your Name *</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className={inputClass} placeholder="Full name" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(1)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
            <button type="button" disabled={!canContinueFromStep2} onClick={() => setStep(3)} className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 flex items-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Business Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@company.com" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>WhatsApp / Phone</label>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} placeholder="+..." />
            </div>
            <div>
              <label className={labelClass}>Website (optional)</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://..." />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(2)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
            <button type="button" disabled={!canContinueFromStep3} onClick={() => setStep(4)} className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 flex items-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Estimated Monthly Volume</label>
              <select name="volume" value={formData.volume} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="<500">Under 500 units</option>
                <option value="500-2000">500 – 2,000 units</option>
                <option value="2000-10000">2,000 – 10,000 units</option>
                <option value="10000+">10,000+ units</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Current Business</label>
              <select name="currentActivity" value={formData.currentActivity} onChange={handleChange} className={inputClass}>
                <option value="">Select...</option>
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="New startup">New startup</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className={`${inputClass} resize-none`} placeholder="Tell us a bit about your business and what you're looking for..."></textarea>
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setStep(3)} className="text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"><ArrowLeft size={14} /> Back</button>
            <button type="submit" disabled={loading} className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[160px]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Submit Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
