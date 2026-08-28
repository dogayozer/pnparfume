'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ShoppingBag, Bot, ShoppingCart, Check, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'
import { BOTTLE_OPTIONS, DEFAULT_BOTTLE_CODE, toSecureImageUrl } from '@/lib/bottleOptions'

interface ProductActionsProps {
  sku: string
  name: string
  price: number
  trendyolUrl?: string | null
  isOutOfStock: boolean
  gender?: string
}

type Concentration = 'edp' | 'extrait'

// Fiyat kuralları — kolayca değiştirilebilir:
const EXTRAIT_SURCHARGE = 200 // Extrait de Parfum'a yükseltme

export default function ProductActions({ sku, name, price, trendyolUrl, isOutOfStock }: ProductActionsProps) {
  const router = useRouter()
  const { addToCart, setIsCartOpen } = useCart()
  const [showIntent, setShowIntent] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)

  const [concentration, setConcentration] = useState<Concentration>('edp')
  const [bottleCode, setBottleCode] = useState(DEFAULT_BOTTLE_CODE)

  useEffect(() => {
    // 12 saniye sonra limbik sistemi uyaran hafif renk değişimi (Karar hızlandırıcı)
    const intentTimer = setTimeout(() => {
      setShowIntent(true)
    }, 12000)

    return () => {
      clearTimeout(intentTimer)
    }
  }, [])

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart({
      sku,
      name,
      price,
      quantity: 1
    })
  }

  const selectedBottle = BOTTLE_OPTIONS.find(b => b.code === bottleCode) || BOTTLE_OPTIONS[0]

  // Canlı fiyat hesabı: esans fiyatı + Extrait farkı + seçilen şişenin tam
  // fiyatı (kutu dahil — hangi şişe seçilirse seçilsin tam fiyatı eklenir,
  // kaynak: Excel "sise" sayfası).
  const computeCustomPrice = () => {
    const p = price + (concentration === 'extrait' ? EXTRAIT_SURCHARGE : 0)
    return p + selectedBottle.price
  }

  const customPrice = computeCustomPrice()
  const canMix = concentration === 'extrait'

  const handleAddCustomToCart = () => {
    if (isOutOfStock) return
    const configSku = `${sku}-${concentration.toUpperCase()}-${selectedBottle.code}`
    const configLabel = `${concentration === 'extrait' ? 'Extrait' : 'EDP'}, ${selectedBottle.label} ${selectedBottle.volumeMl}ml`

    addToCart({
      sku: configSku,
      name: `${name} (${configLabel})`,
      price: customPrice,
      quantity: 1,
      size: `${selectedBottle.volumeMl}ml`,
      imageUrl: toSecureImageUrl(selectedBottle.imageUrl)
    })

    setIsCartOpen(true)
  }

  const handleMix = () => {
    if (!canMix) return
    router.push(`/mix/engine?base=${encodeURIComponent(sku)}`)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 relative mb-4">
        {!isOutOfStock ? (
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 font-medium uppercase tracking-widest text-sm rounded-full transition-all duration-1000 ease-in-out ${
              showIntent
                ? 'bg-accent-gold text-background shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-[1.02]'
                : 'bg-foreground text-background hover:bg-accent-gold/80'
            }`}
          >
            <ShoppingCart size={16} />
            Sepete Ekle
          </button>
        ) : (
          <button disabled className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-foreground/5 text-foreground/50 font-medium uppercase tracking-widest text-sm rounded-full cursor-not-allowed border border-foreground/10">
            Tükendi
          </button>
        )}
      </div>

      {/* Benim İçin Özelleştir */}
      {!isOutOfStock && (
        <div className="text-center sm:text-left mt-6">
          <div className="inline-block">
            <div 
              className="relative inline-flex p-[2px] rounded-full overflow-hidden mb-3 cursor-pointer group shadow-sm hover:shadow-md transition-shadow" 
              onClick={() => setShowCustomize(v => !v)}
            >
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_40%,#D4AF37_100%)] animate-[spin_3s_linear_infinite]"></div>
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-background rounded-full text-sm text-foreground group-hover:text-accent-gold transition-colors font-medium tracking-wide">
                <Sparkles size={16} className="text-accent-gold" />
                Benim İçin Özelleştir
              </div>
            </div>
            <p className="text-[11px] md:text-xs text-foreground/50 leading-relaxed max-w-sm mx-auto sm:mx-0 sm:ml-2">
              Daha fazla yoğunlaştırabilir veya sevdiğiniz başka bir koku ile MİX edebilir, şişe ebatını değiştirebilirsiniz.
            </p>
          </div>

          <AnimatePresence>
            {showCustomize && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 md:mt-6 p-4 md:p-6 bg-foreground/5 border border-foreground/10 rounded-2xl space-y-5 md:space-y-6">

                  {/* Konsantrasyon */}
                  <div>
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3">Konsantrasyon</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      <button
                        onClick={() => setConcentration('edp')}
                        className={`flex items-center justify-between p-3 md:px-4 md:py-3 rounded-xl border text-[11px] md:text-sm transition-colors ${concentration === 'edp' ? 'border-accent-gold bg-accent-gold/10 text-foreground' : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'}`}
                      >
                        EDP (Standart)
                        {concentration === 'edp' && <Check size={14} className="text-accent-gold" />}
                      </button>
                      <button
                        onClick={() => setConcentration('extrait')}
                        className={`flex items-center justify-between p-3 md:px-4 md:py-3 rounded-xl border text-[11px] md:text-sm transition-colors ${concentration === 'extrait' ? 'border-accent-gold bg-accent-gold/10 text-foreground' : 'border-foreground/10 text-foreground/60 hover:border-foreground/30'}`}
                      >
                        Esans (Extrait) +{EXTRAIT_SURCHARGE} ₺
                        {concentration === 'extrait' && <Check size={14} className="text-accent-gold" />}
                      </button>
                    </div>
                  </div>

                  {/* Şişe Seçimi (kutu dahil) */}
                  <div>
                    <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/50 mb-3">Şişe Seçimi (Kutu Dahil)</h4>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                      {BOTTLE_OPTIONS.map(b => (
                        <button
                          key={b.code}
                          onClick={() => setBottleCode(b.code)}
                          className={`flex flex-col items-center gap-1.5 p-2 md:p-3 rounded-xl border transition-colors ${bottleCode === b.code ? 'border-accent-gold bg-accent-gold/10' : 'border-foreground/10 hover:border-foreground/30'}`}
                        >
                          <img src={toSecureImageUrl(b.imageUrl)} alt={b.label} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                          <span className="text-[10px] md:text-[11px] font-medium text-foreground text-center leading-tight">{b.label}</span>
                          <span className="text-[9px] md:text-[10px] text-foreground/50">{b.volumeMl}ml · {b.price} ₺</span>
                          {bottleCode === b.code && <Check size={12} className="text-accent-gold mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fiyat + Aksiyonlar */}
                  <div className="pt-4 border-t border-foreground/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1">
                      <span className="text-xs text-foreground/50 uppercase tracking-widest block mb-1">Özel Konfigürasyon Fiyatı</span>
                      <span className="text-2xl font-light text-foreground">{customPrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <button
                      onClick={handleAddCustomToCart}
                      className="flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-3 bg-foreground text-background rounded-full text-[10px] md:text-sm font-medium uppercase tracking-widest hover:bg-accent-gold/80 transition-colors"
                    >
                      <ShoppingCart size={16} /> Bu Konfigürasyonu Sepete Ekle
                    </button>
                  </div>

                  {/* Mix */}
                  <div className="pt-2">
                    <button
                      onClick={handleMix}
                      disabled={!canMix}
                      title={!canMix ? 'Mix seçeneği yalnızca Extrait konsantrasyonunda aktif olur' : undefined}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium uppercase tracking-widest border transition-colors ${
                        canMix
                          ? 'border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-background'
                          : 'border-foreground/10 text-foreground/30 cursor-not-allowed'
                      }`}
                    >
                      <Wand2 size={16} /> Bu Ürünü Bana Mix&apos;le (+{300} TL&apos;den başlar)
                    </button>
                    {!canMix && (
                      <p className="text-[11px] text-foreground/40 mt-2 text-center">
                        Mix seçeneği yalnızca &quot;Extrait&quot; konsantrasyonu seçildiğinde aktif olur.
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </>
  )
}
