'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Wallet, Gift, Users, Copy, Check, Package, Clock, 
  ShieldCheck, Info, Lock, AlertCircle, Eye, EyeOff, Share2, 
  MessageCircle, TrendingUp, Sparkles, Award, DollarSign, 
  RefreshCw, Send, CheckCircle2, ChevronRight, ExternalLink, Tag, LogOut
} from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'ozet' | 'kuponlar' | 'siparisler' | 'b2b' | 'ayarlar'>('ozet')
  const [orderSubTab, setOrderSubTab] = useState<'aktif' | 'gecmis'>('aktif')
  
  // Address Update State
  const [addressData, setAddressData] = useState({ phone: '', address: '' })
  const [addressMsg, setAddressMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // Password Change State
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  // State for order address update
  const [orders, setOrders] = useState<any[]>([])
  const [referredOrders, setReferredOrders] = useState<any[]>([])
  const [editingOrderAddr, setEditingOrderAddr] = useState<string | null>(null)
  const [newOrderAddr, setNewOrderAddr] = useState('')
  const [orderAddrMsg, setOrderAddrMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Ambassador (Affiliate) States
  const [copiedRefCode, setCopiedRefCode] = useState(false)
  const [copiedRefLink, setCopiedRefLink] = useState(false)
  const [applyInstagram, setApplyInstagram] = useState('')
  const [applyType, setApplyType] = useState<'influencer' | 'b2b_sampler'>('influencer')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyMsg, setApplyMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Wallet to Coupon State
  const [convertAmount, setConvertAmount] = useState('')
  const [convertLoading, setConvertLoading] = useState(false)
  const [convertMsg, setConvertMsg] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Tüm /api/user/* ve ilgili çağrılar artık kimlik doğrulaması istiyor (bkz.
  // src/lib/customerAuth.ts) — bu yardımcı, kayıtlı oturum token'ını okuyup
  // Authorization header'ı olarak ekler.
  const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pn_session') : null
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch('/api/user/me', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId })
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        if (data.orders) setOrders(data.orders)
        if (data.referredOrders) setReferredOrders(data.referredOrders)
        setAddressData({
          phone: data.phone || '',
          address: data.address || ''
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      setAddressData({
        phone: parsed.phone || '',
        address: parsed.address || ''
      })
      fetchUserData(parsed.id)
    }
  }, [])

  const handleOrderAddrUpdate = async (orderId: string) => {
    if (!newOrderAddr.trim()) return
    try {
      const res = await fetch('/api/orders/update-address', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ orderId, customerAddress: newOrderAddr })
      })
      const data = await res.json()
      if (res.ok) {
        setOrderAddrMsg({ type: 'success', text: 'Sipariş teslimat adresi güncellendi.' })
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, customerAddress: newOrderAddr } : o))
        setEditingOrderAddr(null)
      } else {
        setOrderAddrMsg({ type: 'error', text: data.error || 'Adres güncellenemedi.' })
      }
    } catch (e) {
      setOrderAddrMsg({ type: 'error', text: 'Bağlantı hatası' })
    }
    setTimeout(() => setOrderAddrMsg(null), 4000)
  }

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddressLoading(true)
    setAddressMsg(null)

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          phone: addressData.phone,
          address: addressData.address
        })
      })

      const data = await res.json()
      if (res.ok) {
        setAddressMsg({ type: 'success', text: 'Teslimat bilgileriniz başarıyla kaydedildi.' })
        const updated = { ...user, phone: addressData.phone, address: addressData.address }
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
      } else {
        setAddressMsg({ type: 'error', text: data.error || 'Güncelleme yapılamadı.' })
      }
    } catch {
      setAddressMsg({ type: 'error', text: 'Bir hata oluştu, lütfen tekrar deneyin.' })
    } finally {
      setAddressLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      setPwdMsg({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' })
      return
    }
    setPwdLoading(true)
    setPwdMsg(null)

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      })

      const data = await res.json()
      if (res.ok) {
        setPwdMsg({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' })
        setPasswordData({ current: '', new: '', confirm: '' })
      } else {
        setPwdMsg({ type: 'error', text: data.error || 'Şifre güncellenemedi.' })
      }
    } catch {
      setPwdMsg({ type: 'error', text: 'Sunucu hatası oluştu.' })
    } finally {
      setPwdLoading(false)
    }
  }

  const handleAmbassadorApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setApplyLoading(true)
    setApplyMsg(null)

    try {
      const res = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          instagramHandle: applyInstagram,
          partnerType: applyType
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setApplyMsg({ type: 'success', text: data.message })
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        fetchUserData(user.id)
      } else {
        setApplyMsg({ type: 'error', text: data.error || 'Başvuru yapılamadı.' })
      }
    } catch {
      setApplyMsg({ type: 'error', text: 'Bağlantı hatası oluştu.' })
    } finally {
      setApplyLoading(false)
    }
  }

  const handleConvertToCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(convertAmount)
    if (!user || !amountNum || amountNum <= 0) return

    setConvertLoading(true)
    setConvertMsg(null)

    try {
      const res = await fetch('/api/affiliate/wallet-to-coupon', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userId: user.id,
          amount: amountNum
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setConvertMsg({ type: 'success', text: `${data.message} Kodunuz: ${data.coupon}` })
        setConvertAmount('')
        setUser({ ...user, wallet_balance: data.newBalance })
        fetchUserData(user.id)
      } else {
        setConvertMsg({ type: 'error', text: data.error || 'Kupon oluşturulamadı.' })
      }
    } catch {
      setConvertMsg({ type: 'error', text: 'Bağlantı hatası oluştu.' })
    } finally {
      setConvertLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ödeme Bekliyor'
      case 'paid': return 'Hazırlanıyor / İşlemde'
      case 'shipped': return 'Kargoya Verildi'
      case 'delivered': return 'Teslim Edildi'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }

  const displayUser = user || {
    name: 'Değerli Üyemiz',
    email: '',
    partner_type: 'retail',
    referral_code: 'PN-VIP-001',
    wallet_balance: 0,
    earned_samples: 0
  }

  const activeOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'paid' || o.status === 'shipped')
  const pastOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'cancelled')
  const referralLink = `https://pnparfume.com/?ref=${displayUser.referral_code || ''}`
  const totalReferredCommission = referredOrders.reduce((sum: number, o: any) => sum + (o.affiliateEarned || 0), 0)

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" /> Ana Sayfaya Dön
        </Link>

        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-light tracking-wide mb-2 text-foreground">Hesabım</h1>
            <p className="text-foreground/60 font-light">Hoş geldin, {displayUser.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {displayUser.partner_type === 'influencer' && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-accent-gold text-xs font-semibold">
                <Award size={16} /> Resmi Marka Elçisi
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
              title="Hesaptan Güvenli Çıkış Yap"
            >
              <LogOut size={16} /> Çıkış Yap
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sol Menü (Tabs) */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
              <button 
                onClick={() => setActiveTab('ozet')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'ozet' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Users size={18} /> Hesap Özeti
              </button>
              <button 
                onClick={() => setActiveTab('siparisler')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'siparisler' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Package size={18} /> Sipariş Yönetimi
              </button>
              <button 
                onClick={() => setActiveTab('b2b')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'b2b' ? 'bg-accent-gold/15 text-accent-gold font-medium border border-accent-gold/20' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Award size={18} className="text-accent-gold" /> Marka Elçiliği & Kazanç
              </button>
              <button 
                onClick={() => setActiveTab('kuponlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'kuponlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Gift size={18} /> Ayrıcalık & Kuponlar
              </button>
              <button 
                onClick={() => setActiveTab('ayarlar')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm ${activeTab === 'ayarlar' ? 'bg-foreground/5 text-foreground font-medium' : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Lock size={18} /> Ayarlar ve Güvenlik
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-sm text-rose-400 hover:bg-rose-500/10 mt-2 border border-rose-500/20"
              >
                <LogOut size={18} /> Çıkış Yap
              </button>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="flex-1">
            
            {/* ==================== HESAP OZETI ==================== */}
            {activeTab === 'ozet' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cüzdan — pazarlama açısından öne çıkarılsın diye dönen çerçeve */}
                  <div className="rotating-frame rounded-3xl p-[2px]">
                    <div className="bg-background border border-foreground/10 rounded-3xl p-8 relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Wallet size={120} />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Cüzdan Bakiyesi</p>
                      <h2 className="text-4xl font-light text-accent-gold mb-3">{displayUser.wallet_balance} TL</h2>
                      <p className="text-xs text-foreground/70 leading-relaxed font-light mb-4">
                        Tavsiye ve elçilik kazançlarınızı sonraki alışverişlerinizde harcayabilir veya kupona dönüştürebilirsiniz.
                      </p>
                      <button
                        onClick={() => setActiveTab('b2b')}
                        className="inline-flex items-center gap-1.5 text-xs text-accent-gold hover:underline font-medium"
                      >
                        Kazanç Paneline Git <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Son Siparişler Özeti */}
                  <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
                    <p className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Toplam Siparişiniz</p>
                    <h2 className="text-4xl font-light text-foreground mb-3">{orders.length} Adet</h2>
                    <p className="text-xs text-foreground/70 leading-relaxed font-light mb-4">
                      Aktif ve geçmiş tüm parfüm siparişlerinizi ve kargo durumunu anlık takip edin.
                    </p>
                    <button 
                      onClick={() => setActiveTab('siparisler')}
                      className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-accent-gold transition-colors font-medium"
                    >
                      Siparişleri İncele <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Hızlı Davet & Paylaşım Kartı — pazarlama açısından en önemlisi, dönen çerçeve */}
                <div className="rotating-frame rounded-3xl p-[2px]">
                <div className="bg-gradient-to-br from-amber-500/10 via-background to-accent-gold/5 border border-accent-gold/20 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block mb-1">Tavsiye Et & Kazan</span>
                      <h3 className="text-xl font-light text-foreground mb-2">Arkadaşlarına %10 İndirim Kazandır, Sen %15 Nakit Kazan!</h3>
                      <p className="text-xs text-foreground/70 font-light max-w-lg">
                        Sana özel referans kodunla alışveriş yapan her arkadaşın için sipariş tutarının %15'i anında cüzdanına yansır.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink)
                          setCopiedRefLink(true)
                          setTimeout(() => setCopiedRefLink(false), 2000)
                        }}
                        className="bg-foreground text-background px-5 py-3 rounded-xl text-xs font-medium hover:bg-accent-gold transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedRefLink ? <Check size={14} /> : <Copy size={14} />}
                        {copiedRefLink ? 'Link Kopyalandı' : 'Referans Linkini Kopyala'}
                      </button>

                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`PN Parfüm'de sana özel %10 indirim hediyem var! Özel koku koleksiyonunu keşfetmek için linke tıkla: ${referralLink}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={14} /> WhatsApp'ta Paylaş
                      </a>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* ==================== MARKA ELCILIGI & KAZANC PANELI ==================== */}
            {activeTab === 'b2b' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-widest text-accent-gold font-bold">PN Marka Elçiliği</span>
                    <span className="bg-accent-gold/20 text-accent-gold text-[10px] font-bold px-2 py-0.5 rounded-full">%15 Komisyon</span>
                  </div>
                  <h2 className="text-3xl font-light text-foreground mb-2">Elçi & Ortaklık Kazanç Paneli</h2>
                  <p className="text-foreground/60 text-sm font-light">Referans kodunuzla yönlendirdiğiniz siparişleri ve hakedişlerinizi buradan yönetin.</p>
                </div>

                {/* Elçilik Metrikleri */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">Kullanılabilir Bakiye</span>
                    <div className="text-3xl font-light text-accent-gold">{displayUser.wallet_balance} TL</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">Alışverişte veya kuponda kullanılabilir</span>
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">Yönlendirilen Sipariş</span>
                    <div className="text-3xl font-light text-foreground">{referredOrders.length} Adet</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">Referansınızla tamamlanan</span>
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
                    <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">Toplam Hakediş Kazancı</span>
                    <div className="text-3xl font-light text-emerald-600">{totalReferredCommission} TL</div>
                    <span className="text-[11px] text-foreground/40 mt-1 block">Bugüne kadar üretilen komisyon</span>
                  </div>
                </div>

                {/* Özel Paylaşım Araçları */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-light text-foreground flex items-center gap-2">
                    <Share2 size={18} className="text-accent-gold" /> Paylaşım & Davet Araçlarınız
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Referans Kodu */}
                    <div className="bg-background p-5 rounded-2xl border border-foreground/10 space-y-2">
                      <span className="text-xs text-foreground/50 font-medium block">Özel İndirim Kodunuz (%10 İndirim):</span>
                      <div className="flex items-center justify-between bg-foreground/5 p-3 rounded-xl">
                        <span className="font-mono font-bold text-accent-gold text-base">{displayUser.referral_code}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(displayUser.referral_code)
                            setCopiedRefCode(true)
                            setTimeout(() => setCopiedRefCode(false), 2000)
                          }}
                          className="text-xs text-foreground hover:text-accent-gold flex items-center gap-1"
                        >
                          {copiedRefCode ? <Check size={13} /> : <Copy size={13} />}
                          {copiedRefCode ? 'Kopyalandı' : 'Kodu Kopyala'}
                        </button>
                      </div>
                      <p className="text-[11px] text-foreground/50">Arkadaşlarınız sepet ekranında bu kodu girerek %10 indirim kazanır.</p>
                    </div>

                    {/* Referans Linki */}
                    <div className="bg-background p-5 rounded-2xl border border-foreground/10 space-y-2">
                      <span className="text-xs text-foreground/50 font-medium block">Direkt Davet Linkiniz:</span>
                      <div className="flex items-center justify-between bg-foreground/5 p-3 rounded-xl">
                        <span className="font-mono text-xs text-foreground/80 truncate max-w-[180px]">{referralLink}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink)
                            setCopiedRefLink(true)
                            setTimeout(() => setCopiedRefLink(false), 2000)
                          }}
                          className="text-xs text-foreground hover:text-accent-gold flex items-center gap-1"
                        >
                          {copiedRefLink ? <Check size={13} /> : <Copy size={13} />}
                          {copiedRefLink ? 'Kopyalandı' : 'Linki Kopyala'}
                        </button>
                      </div>
                      <p className="text-[11px] text-foreground/50">Bu linke tıklayarak gelen ziyaretçiler 30 gün boyunca sizinle eşleşir.</p>
                    </div>
                  </div>
                </div>

                {/* Bakiye Kullanımı / Kupona Dönüştürme */}
                <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
                    <Gift size={18} className="text-accent-gold" /> Bakiyeyi Hediye Kuponuna Dönüştür
                  </h3>
                  <p className="text-xs text-foreground/60 font-light mb-6">
                    Cüzdanınızdaki bakiyeyi dilediğiniz tutarda PN Parfüm alışveriş çekine (%100 geçerli kupona) anında dönüştürebilirsiniz.
                  </p>

                  {convertMsg && (
                    <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 border ${convertMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'}`}>
                      <AlertCircle size={15} /> {convertMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleConvertToCoupon} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input 
                      type="number"
                      placeholder={`Tutar girin (Maks: ${displayUser.wallet_balance} TL)`}
                      value={convertAmount}
                      onChange={e => setConvertAmount(e.target.value)}
                      max={displayUser.wallet_balance}
                      min="10"
                      className="flex-1 bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:border-accent-gold outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={convertLoading || !displayUser.wallet_balance || displayUser.wallet_balance <= 0}
                      className="bg-foreground text-background px-6 py-3 rounded-xl text-xs font-medium hover:bg-accent-gold transition-colors disabled:opacity-40 whitespace-nowrap"
                    >
                      {convertLoading ? 'Oluşturuluyor...' : 'Kupona Dönüştür'}
                    </button>
                  </form>
                </div>

                {/* Yönlendirilen Siparişler Tablosu */}
                <div>
                  <h3 className="text-lg font-light text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-accent-gold" /> Yönlendirilen Siparişler ({referredOrders.length})
                  </h3>

                  <div className="bg-background border border-foreground/10 rounded-3xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-foreground/5 border-b border-foreground/10 text-foreground/50 font-semibold">
                          <th className="px-6 py-4">Sipariş No</th>
                          <th className="px-6 py-4">Tarih</th>
                          <th className="px-6 py-4">Sipariş Tutarı</th>
                          <th className="px-6 py-4">Durum</th>
                          <th className="px-6 py-4 text-right">Kazanılan Komisyon (%15)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5">
                        {referredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-foreground/40">
                              Henüz referans kodunuzla verilmiş bir sipariş bulunmuyor. Linkinizi paylaşarak kazanmaya başlayabilirsiniz!
                            </td>
                          </tr>
                        ) : (
                          referredOrders.map((ro: any) => (
                            <tr key={ro.id} className="hover:bg-foreground/[0.02]">
                              <td className="px-6 py-4 font-mono font-medium text-foreground/80">
                                PN-***{ro.orderNumber?.slice(-4)}
                              </td>
                              <td className="px-6 py-4 text-foreground/60">
                                {new Date(ro.createdAt).toLocaleDateString('tr-TR')}
                              </td>
                              <td className="px-6 py-4 font-medium text-foreground">
                                {ro.totalAmount} TL
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                  ro.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                  ro.status === 'paid' ? 'bg-blue-500/10 text-blue-600' : 'bg-foreground/5 text-foreground/60'
                                }`}>
                                  {getOrderStatusText(ro.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-accent-gold text-sm">
                                +{ro.affiliateEarned || Math.round(ro.totalAmount * 0.15)} TL
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Marka Elçiliği Başvuru / Aktivasyon Alanı (Eğer henüz influencer değilse) */}
                {displayUser.partner_type === 'retail' && (
                  <div className="bg-gradient-to-br from-accent-gold/10 via-background to-foreground/5 border border-accent-gold/30 rounded-3xl p-8">
                    <div className="max-w-xl">
                      <span className="text-xs uppercase tracking-widest text-accent-gold font-bold block mb-1">Ayrıcalıklı Elçi Programı</span>
                      <h3 className="text-2xl font-light text-foreground mb-2">PN Parfüm Marka Elçisi Olun</h3>
                      <p className="text-xs text-foreground/70 font-light leading-relaxed mb-6">
                        Sosyal medya takipçilerinize veya çevrenize imza kokularımızı tavsiye ederek her başarılı siparişten anında %15 net komisyon kazanın.
                      </p>

                      {applyMsg && (
                        <div className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 border ${applyMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'}`}>
                          <AlertCircle size={15} /> {applyMsg.text}
                        </div>
                      )}

                      <form onSubmit={handleAmbassadorApply} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Instagram / TikTok @kullanıcıadınız"
                            value={applyInstagram}
                            onChange={e => setApplyInstagram(e.target.value)}
                            className="bg-background border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none"
                          />
                          <select 
                            value={applyType}
                            onChange={e => setApplyType(e.target.value as any)}
                            className="bg-background border border-foreground/10 rounded-xl px-4 py-3 text-xs focus:border-accent-gold outline-none"
                          >
                            <option value="influencer">Influencer / Bireysel Elçi</option>
                            <option value="b2b_sampler">Kurumsal / B2B Sampler</option>
                          </select>
                        </div>
                        <button 
                          type="submit"
                          disabled={applyLoading}
                          className="bg-foreground text-background px-8 py-3 rounded-xl text-xs font-semibold hover:bg-accent-gold transition-colors shadow-lg"
                        >
                          {applyLoading ? 'Aktif Ediliyor...' : 'Marka Elçisi Olarak Başla'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== SIPARISLER ==================== */}
            {activeTab === 'siparisler' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-light text-foreground">Sipariş Yönetimi</h2>
                  <div className="flex gap-2 bg-foreground/5 p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setOrderSubTab('aktif')}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${orderSubTab === 'aktif' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      Aktif Siparişler ({activeOrders.length})
                    </button>
                    <button 
                      onClick={() => setOrderSubTab('gecmis')}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${orderSubTab === 'gecmis' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      Geçmiş Siparişler ({pastOrders.length})
                    </button>
                  </div>
                </div>

                {orderAddrMsg && (
                  <div className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${orderAddrMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                    <AlertCircle size={18} /> {orderAddrMsg.text}
                  </div>
                )}

                <div className="space-y-4">
                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).map((order: any) => (
                    <div key={order.id} className="bg-background border border-foreground/10 rounded-3xl p-6 lg:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-foreground/10 mb-6">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Sipariş No</p>
                          <p className="font-mono text-sm text-foreground font-semibold">{order.orderNumber || order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Tarih</p>
                          <p className="text-sm text-foreground font-light">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Toplam Tutar</p>
                          <p className="text-sm font-medium text-accent-gold">{order.totalAmount} TL</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Durum</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-500/10 text-green-700' :
                            order.status === 'shipped' ? 'bg-purple-500/10 text-purple-700' :
                            order.status === 'paid' ? 'bg-blue-500/10 text-blue-700' : 'bg-amber-500/10 text-amber-700'
                          }`}>
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                      </div>

                      {/* Kargo Takip Bilgisi */}
                      {(order.status === 'shipped' || order.status === 'delivered') && order.trackingCode && (
                        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl mb-4 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-purple-600">{order.cargoCompany || 'Kargo'}: </span>
                            <span className="font-mono text-foreground font-medium ml-1">{order.trackingCode}</span>
                          </div>
                          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Kargoda</span>
                        </div>
                      )}

                      {/* Sipariş İçeriği */}
                      <div className="w-full">
                        <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">Sipariş İçeriği</p>
                        <ul className="space-y-2 mb-4">
                          {(order.items as any[])?.map((item: any, idx: number) => (
                            <li key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-foreground/80 font-light">{item.quantity}x {item.name}</span>
                              <span className="font-mono text-xs text-foreground/40">{item.price} TL</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="bg-foreground/5 p-4 rounded-xl mt-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs uppercase tracking-widest text-foreground/50">Teslimat Adresi</p>
                            {(order.status === 'pending' || order.status === 'paid') && (
                              <button 
                                onClick={() => {
                                  setEditingOrderAddr(order.id)
                                  setNewOrderAddr(order.customerAddress || '')
                                }}
                                className="text-xs text-accent-gold hover:underline"
                              >
                                Adresi Değiştir
                              </button>
                            )}
                          </div>
                          
                          {editingOrderAddr === order.id ? (
                            <div className="mt-2 space-y-3">
                              <textarea 
                                value={newOrderAddr}
                                onChange={e => setNewOrderAddr(e.target.value)}
                                className="w-full bg-background border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleOrderAddrUpdate(order.id)} className="bg-foreground text-background px-4 py-2 rounded-lg text-xs hover:bg-accent-gold transition-colors">Kaydet</button>
                                <button onClick={() => setEditingOrderAddr(null)} className="px-4 py-2 rounded-lg text-xs hover:bg-foreground/5">İptal</button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-foreground/80">{order.customerAddress || 'Adres bilgisi bulunamadı'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(orderSubTab === 'aktif' ? activeOrders : pastOrders).length === 0 && (
                    <div className="text-center py-12 text-foreground/40 font-light bg-foreground/5 rounded-3xl">
                      Bu kategoride siparişiniz bulunmamaktadır.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== AYRICALIKLAR & KUPONLAR ==================== */}
            {activeTab === 'kuponlar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-light mb-2 text-foreground">Kupon ve Ayrıcalık Kasası</h2>
                  <p className="text-foreground/60 text-sm font-light">Hesabınıza tanımlanmış indirim kuponları ve hediye hakları.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayUser.coupons?.map((coupon: any, idx: number) => (
                    <div key={idx} className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative flex flex-col justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-accent-gold block mb-1">
                          {coupon.discount_type === 'percentage' ? `%${coupon.value} İndirim` : `${coupon.value} TL İndirim`}
                        </span>
                        <h4 className="text-lg font-light text-foreground mb-4">Özel Kupon</h4>
                      </div>
                      <div className="bg-background p-3 rounded-xl flex items-center justify-between border border-foreground/10">
                        <span className="font-mono text-sm font-bold text-foreground">{coupon.code}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code)
                            alert('Kupon kodu kopyalandı!')
                          }}
                          className="text-xs text-accent-gold hover:underline"
                        >
                          Kopyala
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!displayUser.coupons || displayUser.coupons.length === 0) && (
                    <div className="col-span-2 text-center py-12 text-foreground/40 font-light bg-foreground/5 rounded-3xl">
                      Tanımlı kuponunuz bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== AYARLAR & GUVENLIK ==================== */}
            {activeTab === 'ayarlar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
                <div>
                  <h2 className="text-2xl font-light mb-2 text-foreground">Ayarlar ve Güvenlik</h2>
                  <p className="text-foreground/60 text-sm font-light">İletişim ve teslimat bilgilerinizi buradan yönetebilirsiniz.</p>
                </div>

                <div className="bg-background border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-medium mb-6 text-foreground">İletişim ve Teslimat Bilgileri</h3>
                  
                  {addressMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${addressMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                      <AlertCircle size={18} /> <span>{addressMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddressUpdate} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">Telefon Numarası</label>
                      <input 
                        type="tel"
                        required
                        value={addressData.phone}
                        onChange={e => setAddressData({...addressData, phone: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">Açık Adres (Siparişler için)</label>
                      <textarea 
                        required
                        rows={3}
                        value={addressData.address}
                        onChange={e => setAddressData({...addressData, address: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none resize-none"
                        placeholder="Mahalle, Sokak, No, Daire, İlçe/İl"
                      />
                    </div>
                    <div className="pt-2">
                      <button disabled={addressLoading} type="submit" className="w-full bg-foreground text-background py-3 rounded-xl font-medium hover:bg-accent-gold transition-colors disabled:opacity-50">
                        {addressLoading ? 'Güncelleniyor...' : 'Bilgilerimi Kaydet'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-background border border-foreground/10 rounded-3xl p-8">
                  <h3 className="text-lg font-medium mb-6 text-foreground">Şifre Değiştirme</h3>
                  
                  {pwdMsg && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${pwdMsg.type === 'success' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-red-500/10 text-red-700 border-red-500/20'}`}>
                      <AlertCircle size={18} /> <span>{pwdMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">Mevcut Şifre</label>
                      <input 
                        type={showPwd ? 'text' : 'password'}
                        required
                        value={passwordData.current}
                        onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Yeni Şifre</label>
                        <input 
                          type={showPwd ? 'text' : 'password'}
                          required
                          value={passwordData.new}
                          onChange={e => setPasswordData({...passwordData, new: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/80">Yeni Şifre (Tekrar)</label>
                        <input 
                          type={showPwd ? 'text' : 'password'}
                          required
                          value={passwordData.confirm}
                          onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                          className="w-full bg-foreground/5 border border-transparent focus:border-accent-gold focus:bg-background rounded-xl px-4 py-3 text-foreground transition-colors outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <button 
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="text-sm text-foreground/60 hover:text-foreground flex items-center gap-2 transition-colors"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        Şifreyi Göster
                      </button>

                      <button 
                        type="submit"
                        disabled={pwdLoading}
                        className="bg-foreground text-background px-8 py-3 rounded-xl text-sm font-medium hover:bg-accent-gold transition-colors disabled:opacity-50"
                      >
                        {pwdLoading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                      </button>
                    </div>
                  </form>
                </div>
              
                <div className="mt-8 pt-8 border-t border-foreground/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-red-600">Oturumu Kapat</h3>
                    <p className="text-sm text-foreground/60 mt-1">Geçerli cihazdan güvenle çıkış yapın.</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
