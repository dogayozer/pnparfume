'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Tag, Truck, Info, Users, ShieldCheck, Check, Clock } from 'lucide-react'
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
  const [timeLeft, setTimeLeft] = useState(3599) // 59:59
  const [selectedTester, setSelectedTester] = useState<string | null>(null)

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

  // WhatsApp Manuel Sipariş Hazırlığı
  const whatsappNumber = "905323913141"
  const cartText = items.map(i => `- ${i.quantity}x PN ${i.sku} (${i.name}) : ${i.price * i.quantity} TL`).join('%0A')
  const whatsappMessage = `Merhaba, PN Parfüm'den sipariş vermek istiyorum.%0A%0ASepetim:%0A${cartText}%0A%0A🎁 İndirimler & Kargo: -${multiItemDiscount + couponDiscount - shippingFee} TL%0A💳 Toplam Tutar: ${total} TL%0A%0A(Sanal POS kurulumunuz devam ettiği için manuel sipariş oluşturmak istedim, yardımcı olabilir misiniz?)`
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'HOSGELDIN150' || couponCode.toUpperCase() === 'HOŞGELDİN150') {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 150 })
      setCouponCode('')
    } else if (couponCode.length > 3) {
      // Rastgele bir kod girdiyse %10 indirim (mock amaçlı)
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: Math.floor(subtotal * 0.1) })
      setCouponCode('')
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
                    <h3 className="text-xl font-medium text-foreground">PN {item.sku}</h3>
                    <button onClick={() => removeFromCart(item.sku)} className="text-foreground/40 hover:text-accent-rose transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/50 mb-3">{item.name}</p>
                  
                  <div className="mt-auto">
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

              <div className="mb-4 p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl">
                <p className="text-xs text-[#25D366] font-medium leading-relaxed">
                  Sanal POS kurulumumuz devam etmektedir. Sizin için müşteri temsilcimize iletilmek üzere bir manuel sipariş mesajı hazırladık.
                </p>
              </div>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-5 uppercase tracking-widest text-sm font-medium hover:bg-[#1da851] transition-colors rounded-xl shadow-lg"
              >
                WhatsApp İle Sipariş Ver
              </a>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-foreground/40">
                <ShieldCheck size={14} /> Manuel Onaylı Güvenli Sipariş
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
