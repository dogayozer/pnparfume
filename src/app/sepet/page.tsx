'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Tag, Truck, Info, Users, ShieldCheck, Check, Clock, X, CreditCard, LogIn, UserCheck, AlertCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { items, removeFromCart, totalAmount, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
  
  // Paydaş Ekonomisi State
  const [combinedShipping, setCombinedShipping] = useState(false)
  const [friendOrderCode, setFriendOrderCode] = useState('')
  const [shippingDiscountApplied, setShippingDiscountApplied] = useState(false)
  
  // VIP Urgency State
  const [timeLeft, setTimeLeft] = useState(600) // 10:00
  const [selectedTester, setSelectedTester] = useState<string | null>(null)

  // Auth & Checkout State
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isLoginTabOpen, setIsLoginTabOpen] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null)

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setCheckoutForm(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
          address: user.address || prev.address
        }))
      } catch (e) {}
    }
  }, [])

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCheckoutForm({
          name: data.user.name || '',
          email: data.user.email || loginEmail,
          phone: data.user.phone || '',
          address: data.user.address || ''
        })
        setIsLoginTabOpen(false)
        setLoginSuccessMsg(`Hoş geldiniz ${data.user.name || ''}! Kayıtlı bilgileriniz yüklendi.`)
        setTimeout(() => setLoginSuccessMsg(null), 5000)
      } else {
        setLoginError(data.error || 'Giriş yapılamadı. E-posta ve şifrenizi kontrol ediniz.')
      }
    } catch (err) {
      setLoginError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoginLoading(false)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paytrToken, setPaytrToken] = useState<string | null>(null)

  // PayTR official iFrameResizer auto-height integration
  useEffect(() => {
    if (paytrToken) {
      const script = document.createElement('script')
      script.src = 'https://www.paytr.com/js/iframeResizer.min.js'
      script.async = true
      script.onload = () => {
        if ((window as any).iFrameResize) {
          ;(window as any).iFrameResize({}, '#paytriframe')
        }
      }
      document.body.appendChild(script)
      return () => {
        try { document.body.removeChild(script) } catch (e) {}
      }
    }
  }, [paytrToken])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Kurallar (Senaryolardan Gelen)
  const SHIPPING_COST = 100
  const SECOND_ITEM_DISCOUNT = 250

  // Hesaplamalar
  const subtotal = totalAmount
  
  // 2. Ürün İndirimi
  const multiItemDiscount = items.length >= 2 ? SECOND_ITEM_DISCOUNT : 0
  
  // Kargo Ücreti
  let shippingFee = SHIPPING_COST
  if (subtotal >= 2000) shippingFee = 0 // Bedava Kargo Barajı (Örn: 2000 TL)
  if (shippingDiscountApplied) shippingFee = 0 // Arkadaş kargosu

  // Kupon İndirimi
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0

  const total = subtotal - multiItemDiscount - couponDiscount + shippingFee

  // WhatsApp Manuel Sipariş Hazırlığı (Yedek olarak durabilir)
  const whatsappNumber = "905323913141"
  const cartText = items.map(i => `- ${i.quantity}x PN ${i.sku} (${i.name}) : ${i.price * i.quantity} TL`).join('%0A')
  const whatsappMessage = `Merhaba, PN Parfüm'den sipariş vermek istiyorum.%0A%0ASepetim:%0A${cartText}%0A%0A🎁 İndirimler & Kargo: -${multiItemDiscount + couponDiscount - shippingFee} TL%0A💳 Toplam Tutar: ${total} TL`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/paytr/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: checkoutForm,
          userId: JSON.parse(localStorage.getItem('user') || '{}').id || null,
          cart: items,
          totalAmount: total,
          discountApplied: multiItemDiscount + couponDiscount,
          shippingFee: shippingFee,
          couponCode: appliedCoupon?.code,
          friendOrderCode: shippingDiscountApplied ? friendOrderCode : null,
          referralCode: localStorage.getItem('pn_referral_code') || appliedCoupon?.code || null
        })
      })

      const data = await res.json()
      if (data.token) {
        setPaytrToken(data.token)
      } else {
        alert('Ödeme başlatılırken bir hata oluştu: ' + (data.error || 'Bilinmeyen hata'))
      }
    } catch (err) {
      alert('Sistem hatası, lütfen daha sonra tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const res = await fetch('/api/checkout/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })
      const data = await res.json()
      
      if (res.ok && data.value) {
        // value contains fixed discount for now based on our db setup
        let discountAmount = data.value;
        if (data.type === 'percentage') {
          discountAmount = Math.floor(subtotal * (data.value / 100));
        }
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: discountAmount })
        setCouponCode('')
      } else {
        alert(data.error || 'Geçersiz kupon kodu')
      }
    } catch (err) {
      alert('Kupon kontrol edilirken bir hata oluştu.')
    }
  }

  const applyFriendOrder = () => {
    if (friendOrderCode.length > 5) {
      setShippingDiscountApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-6 text-center">
        <h1 className="text-3xl font-light mb-4 text-foreground">Sepetiniz Boş</h1>
        <p className="text-foreground/60 mb-8">Koku imzanızı bulmak için koleksiyonlarımızı keşfedin.</p>
        <Link href="/katalog" className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm hover:bg-accent-gold transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* VIP Urgency Banner */}
        {timeLeft > 0 && (
          <div className="mb-8 bg-gradient-to-r from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-1 flex items-center gap-2">
                <Clock className="text-accent-gold" size={20} /> Yeni Üyeliğinize Özel Ayrıcalık
              </h2>
              <p className="text-sm text-foreground/70 font-light">
                PN Parfüm kulübüne hoş geldiniz. %15 İndirim ve 1 Adet Signature Koku Deneme Boyu (Tester) hediyenizi sepetinize eklemek için size ayrılan süre:
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4 bg-background px-6 py-3 rounded-xl border border-accent-gold/20 shadow-sm">
              <span className="text-2xl font-light tracking-widest text-accent-gold font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide text-foreground">Sepetiniz</h1>
          <p className="text-foreground/60 font-light mt-2">{items.length} ürün seçtiniz.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Sol Kolon: Ürünler */}
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-6 border-b border-foreground/10 pb-6">
                <div className="w-24 h-32 relative bg-foreground/5 rounded-md flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-light text-foreground/30 px-2 text-center">{item.sku}</span>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-medium text-foreground">
                      {item.sku.startsWith('DISCOVERY') ? item.name : `PN ${item.sku}`}
                    </h3>
                    <button onClick={() => removeFromCart(item.sku)} className="text-foreground/40 hover:text-accent-rose transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/50 mb-2">{item.name}</p>

                  {/* 5'li Discovery Set Alt Liste Gösterimi */}
                  {item.selectedScents && item.selectedScents.length > 0 && (
                    <div className="my-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Kutu İçeriği (5x10ml):</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground/80 font-mono">
                        {item.selectedScents.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="text-amber-500 font-bold">•</span> {s} (10ml)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-2">
                    <span className="text-lg font-light text-foreground">{item.price * item.quantity} TL</span>
                    <span className="text-xs text-foreground/40 ml-2">({item.quantity} Adet)</span>
                  </div>
                </div>
              </div>
            ))}

            {/* VIP Tester Selection */}
            {timeLeft > 0 && (
              <div className="mt-8 border border-accent-gold/20 bg-accent-gold/5 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Tag size={18} className="text-accent-gold" /> Hediye Tester Seçiminiz
                </h3>
                <p className="text-sm text-foreground/60 font-light mb-4">Ayrıcalıklı süreniz dolmadan siparişinize eklenecek hediye kokuyu seçin.</p>
                <div className="flex flex-wrap gap-3">
                  {['Pera Leather', 'Smyrna Fig', 'Ephesus Rose'].map(tester => (
                    <button 
                      key={tester}
                      onClick={() => setSelectedTester(tester)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedTester === tester ? 'bg-accent-gold text-background border-accent-gold' : 'bg-background text-foreground/70 border-foreground/10 hover:border-accent-gold/50'}`}
                    >
                      {tester} (2ml)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kolon: Özet & Paydaş Ekonomisi */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-foreground/[0.02] border border-foreground/10 rounded-2xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-medium mb-6 text-foreground">Sipariş Özeti</h2>
              
              {/* Hesaplamalar */}
              <div className="space-y-4 text-sm font-light text-foreground/80 mb-6 border-b border-foreground/10 pb-6">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{subtotal} TL</span>
                </div>
                
                {multiItemDiscount > 0 && (
                  <div className="flex justify-between text-accent-rose font-medium animate-in fade-in">
                    <span className="flex items-center gap-2"><Tag size={14} /> Çoklu Alım İndirimi (2. Ürün)</span>
                    <span>-{multiItemDiscount} TL</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-accent-rose font-medium animate-in fade-in">
                    <span className="flex items-center gap-2"><Tag size={14} /> Kupon ({appliedCoupon?.code})</span>
                    <span>-{couponDiscount} TL</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Kargo Ücreti</span>
                  {shippingFee === 0 ? (
                    <span className="text-accent-gold font-medium flex items-center gap-1">
                      <Truck size={14} /> ÜCRETSİZ
                    </span>
                  ) : (
                    <span>{shippingFee} TL</span>
                  )}
                </div>
              </div>

              {/* Paydaş Ekonomisi */}
              <div className="mb-6 border-b border-foreground/10 pb-6">
                <label className="flex items-start gap-3 cursor-pointer group mb-3">
                  <input 
                    type="checkbox"
                    checked={combinedShipping}
                    onChange={(e) => setCombinedShipping(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border-foreground/30 text-accent-gold focus:ring-accent-gold bg-transparent cursor-pointer"
                  />
                  <div>
                    <span className="block font-medium text-foreground group-hover:text-accent-gold transition-colors">Paydaş Ekonomisi</span>
                    <span className="text-xs text-foreground/60 leading-relaxed">Arkadaşımın siparişi ile aynı kargo paketinde gelsin. (Kargo bedava)</span>
                  </div>
                </label>
                
                {combinedShipping && !shippingDiscountApplied && (
                  <div className="flex gap-2 mt-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="relative flex-1">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                      <input 
                        type="text" 
                        value={friendOrderCode}
                        onChange={(e) => setFriendOrderCode(e.target.value)}
                        placeholder="Arkadaşının Sipariş No (Örn: PN-12345)" 
                        className="w-full bg-background border border-foreground/20 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-accent-gold text-foreground placeholder:text-foreground/30"
                      />
                    </div>
                    <button 
                      onClick={applyFriendOrder}
                      className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-gold transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                )}

                {shippingDiscountApplied && (
                  <div className="mt-3 p-3 bg-accent-gold/10 border border-accent-gold/20 rounded-md flex items-start gap-2 text-sm text-accent-gold animate-in fade-in">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Harika! Siparişiniz <strong>{friendOrderCode}</strong> numaralı paketle birleştirilecek ve kargo ücreti ödemeyeceksiniz.</span>
                  </div>
                )}
              </div>

              {/* Kupon Kodu */}
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">İndirim Kodu / Cüzdan Bakiyesi</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Kod giriniz" 
                    className="flex-1 bg-background border border-foreground/20 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-accent-gold text-foreground placeholder:text-foreground/30 uppercase"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-foreground/10 text-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-medium text-foreground">Toplam</span>
                <div className="text-right">
                  <span className="text-4xl font-light text-foreground">{total} TL</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 bg-foreground text-background py-5 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors rounded-xl shadow-lg"
              >
                Kredi Kartı İle Güvenli Öde
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-foreground/40">
                <ShieldCheck size={14} /> Manuel Onaylı Güvenli Sipariş
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4">
          <div className={`bg-background border border-foreground/10 rounded-2xl w-full ${paytrToken ? 'max-w-3xl h-[94vh] sm:h-[90vh]' : 'max-w-2xl max-h-[90vh]'} flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden`}>
            <div className="sticky top-0 bg-background border-b border-foreground/10 px-6 py-4 flex justify-between items-center z-10 flex-shrink-0">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <CreditCard size={20} className="text-accent-gold" /> Güvenli Ödeme
              </h2>
              <button 
                onClick={() => {
                  setIsCheckoutModalOpen(false)
                  setPaytrToken(null)
                }}
                className="p-2 text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto flex-1 flex flex-col">
              {paytrToken ? (
                <div className="w-full flex-1 min-h-[700px] sm:min-h-[780px] bg-background">
                  <iframe
                    src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="yes"
                    className="w-full rounded-xl"
                    style={{ width: '100%', minHeight: '750px', height: '100%', border: 'none' }}
                  ></iframe>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {/* Member Login Switch / Success Alert */}
                  {currentUser ? (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-emerald-400 font-medium">
                        <UserCheck size={16} />
                        <span><strong>{currentUser.name || currentUser.email}</strong> hesabınızla işlem yapıyorsunuz.</span>
                      </div>
                      <span className="text-[11px] text-foreground/50 hidden sm:inline">Kayıtlı adresiniz yüklendi ✓</span>
                    </div>
                  ) : (
                    <div>
                      {loginSuccessMsg && (
                        <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                          <UserCheck size={14} /> {loginSuccessMsg}
                        </div>
                      )}

                      {!isLoginTabOpen ? (
                        <div className="bg-gradient-to-r from-accent-gold/15 via-accent-gold/5 to-transparent border border-accent-gold/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                              <LogIn size={15} className="text-accent-gold" /> Zaten bir hesabınız var mı?
                            </div>
                            <p className="text-[11px] text-foreground/60 font-light mt-0.5">
                              Giriş yaparak kayıtlı adresinizi otomatik doldurabilir ve siparişinizi profilinizden takip edebilirsiniz.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsLoginTabOpen(true)}
                            className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:bg-accent-gold transition-colors flex-shrink-0"
                          >
                            Hızlı Üye Girişi Yap
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-foreground/[0.03] border border-foreground/15 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
                          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                            <LogIn size={15} className="text-accent-gold" /> Hızlı Üye Girişi
                          </h3>

                          {loginError && (
                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                              <AlertCircle size={14} /> {loginError}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-foreground/70 block mb-1">E-Posta Adresi</label>
                              <input
                                type="email"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                placeholder="ornek@mail.com"
                                className="w-full bg-background border border-foreground/15 rounded-lg p-2.5 text-xs text-foreground focus:border-accent-gold outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-foreground/70 block mb-1">Şifre</label>
                              <input
                                type="password"
                                value={loginPassword}
                                onChange={e => setLoginPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background border border-foreground/15 rounded-lg p-2.5 text-xs text-foreground focus:border-accent-gold outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsLoginTabOpen(false)}
                              className="text-xs text-foreground/50 hover:text-foreground underline"
                            >
                              Misafir olarak devam et
                            </button>

                            <button
                              type="button"
                              onClick={handleInlineLogin}
                              disabled={loginLoading || !loginEmail || !loginPassword}
                              className="px-4 py-2 bg-accent-gold text-background rounded-lg text-xs font-bold hover:bg-accent-gold/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                            >
                              {loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap ve Bilgilerimi Yükle'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-foreground/60">Siparişinizi tamamlamak için teslimat ve fatura bilgilerinizi kontrol ediniz. (3D Secure ile güvenle korunmaktadır)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ad Soyad</label>
                      <input 
                        required 
                        type="text" 
                        value={checkoutForm.name}
                        onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefon</label>
                      <input 
                        required 
                        type="tel" 
                        value={checkoutForm.phone}
                        onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-Posta Adresi</label>
                    <input 
                      required 
                      type="email" 
                      value={checkoutForm.email}
                      onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Teslimat Adresi</label>
                    <textarea 
                      required 
                      rows={3}
                      value={checkoutForm.address}
                      onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})}
                      className="w-full bg-foreground/[0.02] border border-foreground/10 rounded-lg p-3 text-sm focus:border-accent-gold outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        required
                        type="checkbox" 
                        className="mt-1 w-4 h-4 rounded border-foreground/20 text-accent-gold focus:ring-accent-gold focus:ring-offset-background"
                      />
                      <span className="text-xs text-foreground/70 leading-relaxed">
                        <a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">Mesafeli Satış Sözleşmesi</a> ve <a href="/sozlesmeler.html" target="_blank" className="text-accent-gold hover:underline">Ön Bilgilendirme Formu</a>'nu okudum, onaylıyorum. (Cayma hakkı istisnalarını kabul ediyorum).
                      </span>
                    </label>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent-gold text-background py-4 uppercase tracking-widest text-sm font-medium rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Hazırlanıyor...' : `Ödemeye Geç (${total} TL)`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
