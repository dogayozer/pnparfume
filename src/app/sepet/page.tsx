'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Tag, Truck, Info, Users, ShieldCheck, Check } from 'lucide-react'

// Mock Data for Cart Items
const initialCart = [
  {
    id: '1',
    name: 'Smyrna Fig & Incense',
    size: '50ml',
    isExtrait: true, // +200 TL extra
    basePrice: 600,
    extraPrice: 200,
    image: '/cologne_fig_incense_1786736624153.jpg'
  },
  {
    id: '2',
    name: 'Pera Leather & Amber',
    size: '100ml',
    isExtrait: false,
    basePrice: 850,
    extraPrice: 0,
    image: '/cologne_leather_amber_1786736633619.jpg'
  }
]

export default function CartPage() {
  const [items, setItems] = useState(initialCart)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
  
  // Paydaş Ekonomisi State
  const [combinedShipping, setCombinedShipping] = useState(false)
  const [friendOrderCode, setFriendOrderCode] = useState('')
  const [shippingDiscountApplied, setShippingDiscountApplied] = useState(false)

  // Kurallar (Senaryolardan Gelen)
  const SHIPPING_COST = 100
  const SECOND_ITEM_DISCOUNT = 250

  // Hesaplamalar
  const subtotal = items.reduce((sum, item) => sum + item.basePrice + item.extraPrice, 0)
  
  // 2. Ürün İndirimi
  const multiItemDiscount = items.length >= 2 ? SECOND_ITEM_DISCOUNT : 0
  
  // Kargo Ücreti
  let shippingFee = SHIPPING_COST
  if (subtotal >= 2000) shippingFee = 0 // Bedava Kargo Barajı (Örn: 2000 TL)
  if (shippingDiscountApplied) shippingFee = 0 // Arkadaş kargosu

  // Kupon İndirimi
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0

  const total = subtotal - multiItemDiscount - couponDiscount + shippingFee

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

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
        <Link href="/koleksiyonlar/kolonya-ve-kitler" className="inline-block bg-foreground text-background px-8 py-4 uppercase tracking-widest text-sm hover:bg-accent-gold transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-wide text-foreground">Sepetiniz</h1>
          <p className="text-foreground/60 font-light mt-2">{items.length} ürün seçtiniz.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Sol Kolon: Ürünler */}
          <div className="flex-1 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-foreground/10 pb-6">
                <div className="w-24 h-32 relative bg-foreground/5 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply opacity-90" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-medium text-foreground">{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-foreground/40 hover:text-accent-rose transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/50 mb-3">{item.size}</p>
                  
                  {item.isExtrait && (
                    <span className="inline-flex items-center gap-1 text-xs text-accent-gold bg-accent-gold/10 px-2 py-1 rounded-sm w-max mb-3">
                      <ShieldCheck size={12} /> %20 Daha Yoğun Esans (Extrait)
                    </span>
                  )}
                  
                  <div className="mt-auto">
                    <span className="text-lg font-light text-foreground">{item.basePrice + item.extraPrice} TL</span>
                    {item.isExtrait && (
                      <span className="text-xs text-foreground/40 ml-2">({item.basePrice} TL + {item.extraPrice} TL)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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

              <button className="w-full bg-foreground text-background py-5 uppercase tracking-widest text-sm font-medium hover:bg-accent-gold transition-colors group relative overflow-hidden">
                <span className="relative z-10">Güvenle Öde</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-foreground/40">
                <ShieldCheck size={14} /> 256-bit SSL Güvenli Ödeme
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
