'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function CorporateForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: 'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.' })
        setFormData({ name: '', email: '', phone: '', website: '', message: '' })
      } else {
        setStatus({ type: 'error', message: data.error || 'Bir hata oluştu.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'İletişim sırasında bir hata oluştu.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t border-foreground/10 pt-10">
      <h3 className="text-2xl font-light mb-6">Ön Başvuru Formu</h3>
      
      {status && (
        <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {status.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={20} /> : <AlertCircle className="shrink-0 mt-0.5" size={20} />}
          <p className="font-medium text-sm">{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Ad Soyad / Firma Adı *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="Firma veya Yetkili Adı" />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">E-posta Adresi *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="iletisim@sirket.com" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Telefon Numarası *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="05XX XXX XX XX" />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Web Siteniz / Sosyal Medya</label>
            <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors" placeholder="https://www..." />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Satış Stratejiniz & Mesajınız</label>
          <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold transition-colors resize-none" placeholder="Bize kısaca kendinizden ve nasıl bir iş modeli kurguladığınızdan bahsedin..."></textarea>
        </div>

        <button type="submit" disabled={loading} className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[200px]">
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Başvuruyu Gönder'}
        </button>
        <p className="text-xs text-foreground/40 mt-3">Başvurunuz incelendikten sonra ekibimiz sizinle iletişime geçecektir.</p>
      </form>
    </div>
  )
}
