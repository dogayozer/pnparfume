'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ShoppingBag, Bot, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/contexts/CartContext'

interface ProductActionsProps {
  sku: string
  name: string
  price: number
  trendyolUrl?: string | null
  isOutOfStock: boolean
}

export default function ProductActions({ sku, name, price, trendyolUrl, isOutOfStock }: ProductActionsProps) {
  const { addToCart } = useCart()
  const [showIntent, setShowIntent] = useState(false)
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

      {/* Subtle AI Customization Link */}
      {!isOutOfStock && (
        <div className="text-center sm:text-left mt-6">
          <div className="inline-block">
            <button className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent-gold transition-colors font-medium tracking-wide mb-1">
              <Sparkles size={16} className="text-accent-gold" />
              Yapay Zeka ile bu kokuyu bana özel yeniden formüle et
            </button>
            <p className="text-xs text-foreground/50 leading-relaxed ml-6">
              Daha fazla yoğunlaştırabilir veya sevdiğiniz başka bir koku ile MİX edebilir, şişe ebatını değiştirebilirsiniz.
            </p>
          </div>
        </div>
      )}

    </>
  )
}
