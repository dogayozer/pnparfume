'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react'

export default function IletisimPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Sipariş Durumu',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMsg({
          type: 'success',
          text: data.message || 'Mesajınız siparis@pienparfume.com adresine başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.'
        })
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: 'Sipariş Durumu',
          message: ''
        })
      } else {
        setMsg({
          type: 'error',
          text: data.error || 'Mesaj iletilirken bir sorun oluştu. Lütfen WhatsApp üzerinden bize yazınız.'
        })
      }
    } catch {
      setMsg({
        type: 'error',
        text: 'Bağlantı hatası oluştu. Lütfen WhatsApp destek hattımızdan bize ulaşınız.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light mb-4 text-accent-gold">İletişim</h2>
        <p className="text-foreground/70 leading-relaxed">
          Koku seçimi veya siparişleriniz hakkında her türlü sorunuz için uzman ekibimize ulaşabilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          {/* WhatsApp Destek Hattı - Öne Çıkan Kart */}
          <a
            href="https://wa.me/905447360990?text=Merhaba,%20PN%20Parfüm%20hakkında%20bilgi%20ve%20destek%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start space-x-4 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 hover:border-[#25D366]/50 transition-all duration-300 group shadow-sm block"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <MessageCircle size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  WhatsApp Destek Hattı
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#25D366] text-white">Canlı</span>
                </h4>
              </div>
              <p className="text-sm font-mono text-[#25D366] font-bold mt-1">
                +90 544 736 09 90
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Sipariş, koku danışmanlığı ve hızlı destek için WhatsApp üzerinden anında yazabilirsiniz.
              </p>
            </div>
          </a>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Merkez Ofis & Laboratuvar</h4>
              <p className="text-sm text-foreground/60 leading-relaxed">
                PİEN PARFUME / SİLİVRİ / İSTANBUL<br />
                Yeni Sanayi Sit. E-Blok 9.Cad. No:8<br />
                Silivri / İST.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Müşteri Hizmetleri & Santral</h4>
              <p className="text-sm text-foreground/60">
                Telefon: (+90) 212 736 09 90<br />
                WhatsApp: (+90) 544 736 09 90<br />
                Fax: (+90) 212 736 09 91
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">E-posta</h4>
              <p className="text-sm text-foreground/60">
                siparis@pienparfume.com<br />
                info@pnparfume.com
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background border border-transparent hover:border-foreground/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 text-accent-gold">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-1">Çalışma Saatleri</h4>
              <p className="text-sm text-foreground/60">
                Pazartesi - Cuma: 09:00 - 18:00<br />
                Cumartesi - Pazar: Kapalı
              </p>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-background border border-foreground/10 rounded-3xl p-6 md:p-8">
          <h3 className="text-xl font-medium mb-2">Bize Yazın</h3>
          <p className="text-xs text-foreground/60 mb-6">Tüm talepleriniz doğrudan <strong className="text-accent-gold">siparis@pienparfume.com</strong> adresine iletilir.</p>
          
          {msg && (
            <div className={`mb-6 p-4 rounded-2xl text-xs flex items-center gap-3 ${
              msg.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {msg.type === 'success' ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <AlertCircle size={18} className="flex-shrink-0" />}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Ad Soyad *</label>
              <input 
                required
                type="text" 
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Adınız ve Soyadınız"
                className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">E-posta *</label>
                <input 
                  required
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="ornek@mail.com"
                  className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Telefon</label>
                <input 
                  type="tel" 
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="05XX XXX XX XX"
                  className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Konu</label>
              <select 
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 focus:outline-none focus:border-accent-gold focus:bg-background transition-colors text-sm"
              >
                <option value="Sipariş Durumu">Sipariş Durumu</option>
                <option value="Ürün & Koku Danışmanlığı">Ürün & Koku Danışmanlığı</option>
                <option value="İade & Değişim Talebi">İade & Değişim Talebi</option>
                <option value="Bayilik & Kurumsal Teklif">Bayilik & Kurumsal Teklif</option>
                <option value="Genel Görüş & Öneri">Genel Görüş & Öneri</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-foreground/50 mb-2">Mesajınız *</label>
              <textarea 
                required
                rows={4} 
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Size nasıl yardımcı olabiliriz?"
                className="w-full bg-foreground/5 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent-gold focus:bg-background transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background py-4 rounded-xl text-sm font-medium hover:bg-accent-gold transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Gönderiliyor...' : 'Mesajı Gönder'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
