'use client'

import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react'
import { useState } from 'react'
import PerksBanner from '@/components/PerksBanner'

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, addToCart, totalAmount, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const applyCoupon = async () => {
    setError('')
    try {
      const res = await fetch('/api/checkout/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })
      const data = await res.json()
      if (res.ok) {
        setDiscount(data.value)
      } else {
        setError(data.error)
      }
    } catch (e) {
      setError('Bir hata oluştu')
    }
  }

  const checkout = () => {
    setIsCartOpen(false)
    window.location.href = '/sepet'
  }

  const finalAmount = Math.max(0, totalAmount - (totalAmount * discount / 100))

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-[85vw] md:w-full max-w-md h-full bg-background border-l border-foreground/10 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <ShoppingBag size={20} />
                Sepetim
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-foreground/40">
                <ShoppingBag size={48} className="mb-4 opacity-50" />
                <p>Sepetiniz şu an boş.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.map(item => (
                    <div key={item.sku} className="flex gap-4">
                      <div className="w-20 h-24 bg-foreground/5 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-light text-foreground/30">{item.sku}</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">PN {item.sku}</h3>
                            <button onClick={() => removeFromCart(item.sku)} className="text-foreground/40 hover:text-accent-rose">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-foreground/50 line-clamp-1">{item.name}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-medium">₺{item.price * item.quantity}</span>
                          <div className="flex items-center gap-3 bg-foreground/5 rounded-full px-3 py-1">
                            <button 
                              onClick={() => {
                                if (item.quantity > 1) {
                                  removeFromCart(item.sku);
                                  addToCart({ ...item, quantity: item.quantity - 1 })
                                }
                              }}
                              className="text-foreground/60 hover:text-foreground"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart({ ...item, quantity: 1 })}
                              className="text-foreground/60 hover:text-foreground"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-foreground/10 bg-foreground/[0.02]">
                  <div className="flex gap-2 mb-6">
                    <input 
                      type="text" 
                      placeholder="İndirim Kodu (Yapay Zeka vb.)" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-background border border-foreground/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-gold"
                    />
                    <button 
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-accent-gold transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                  {error && <p className="text-accent-rose text-xs mt-[-16px] mb-4">{error}</p>}

                  <div className="mb-4">
                    <PerksBanner compact />
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-foreground/60">
                      <span>Ara Toplam</span>
                      <span>₺{totalAmount}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-accent-rose font-medium">
                        <span>İndirim (%{discount})</span>
                        <span>-₺{(totalAmount * discount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-foreground/10">
                      <span>Toplam</span>
                      <span>₺{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={checkout}
                    className="w-full py-4 bg-foreground text-background rounded-full font-medium tracking-wide hover:bg-accent-gold transition-colors flex items-center justify-center gap-2"
                  >
                    Sepete Git ve Ödemeye Geç
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
