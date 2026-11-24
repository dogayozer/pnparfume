'use client'

import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Sparkles, Truck, Percent } from 'lucide-react'
import { useState } from 'react'
import PerksBanner from '@/components/PerksBanner'
import Link from 'next/link'
import { productLabel } from '@/lib/collections'
import { useT, useMoney, useLang } from '@/lib/i18n'
import { useDealer } from '@/contexts/DealerContext'
import { cartDiscounts } from '@/lib/pricingConstants'
import { FREE_SHIPPING_FOR_ALL } from '@/lib/shippingCampaign'

export default function CartModal() {
  const t = useT()
  const lang = useLang()
  const { isDealer } = useDealer()
  const money = useMoney()
  const { isCartOpen, setIsCartOpen, items, removeFromCart, addToCart, totalAmount, clearCart, appliedCoupon: coupon, setAppliedCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const applyCoupon = async () => {
    setError('')
    if (!couponCode.trim()) { setError(t('Lütfen bir indirim kodu girin', 'Please enter a discount code', 'يرجى إدخال رمز الخصم')); return }
    try {
      const res = await fetch('/api/checkout/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      })
      const data = await res.json()
      if (res.ok) {
        // Kod, sepet sayfasına da taşınır (CartContext + localStorage).
        setAppliedCoupon({ code: couponCode.trim().toUpperCase(), type: data.type, value: data.value })
        setCouponCode('')
      } else {
        setError(data.error || t('Geçersiz kupon kodu', 'Invalid coupon code', 'رمز القسيمة غير صالح'))
      }
    } catch (e) {
      setError(t('Bir hata oluştu', 'Something went wrong', 'حدث خطأ'))
    }
  }

  const checkout = () => {
    setIsCartOpen(false)
    window.location.href = '/sepet'
  }

  // 2. ürün %50 (sepet sayfası ve ödeme ucuyla aynı kural: bkz. secondItemDiscount) ve ücretsiz kargo.
  // 'bogo' (1 alana 1 bedava) kuponu otomatik %50'nin yerine geçer; hesap sepet sayfası/ödeme ucuyla aynı fonksiyondan.
  const { multiItemDiscount, couponDiscount: couponAmount } = cartDiscounts({
    lines: items.map((i) => ({ price: i.price, quantity: i.quantity })),
    isDealer,
    coupon,
  })
  const finalAmount = Math.max(0, totalAmount - multiItemDiscount - couponAmount)
  // Sepette tek birim varsa: ikinci ürünle kazanılabilecek EN FAZLA tutar (ikinci ürün daha pahalıysa mevcut ürünün yarısı).
  const unitCount = items.reduce((n, i) => n + i.quantity, 0)
  const maxPotentialSaving = !isDealer && unitCount === 1 ? Math.floor((items[0]?.price ?? 0) / 2) : 0

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
                <p>{t("Sepetiniz şu an boş.", "Your cart is empty.", "سلتك فارغة.")}</p>
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
                            <h3 className="font-medium">{productLabel(item.sku)}</h3>
                            <button onClick={() => removeFromCart(item.sku)} className="text-foreground/40 hover:text-accent-rose">
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-sm text-foreground/50 line-clamp-1">{item.name}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-medium">{money(item.price * item.quantity)}</span>
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
                  {coupon ? (
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-green-600/40 bg-green-600/10 px-4 py-2 text-sm">
                        <span className="text-green-700 font-medium">✓ {coupon.code} {t('uygulandı', 'applied', 'تم التطبيق')}</span>
                        <button
                          onClick={() => { setAppliedCoupon(null); setError('') }}
                          className="text-xs text-foreground/60 underline hover:text-accent-rose"
                        >
                          {t('Vazgeç', 'Remove', 'إزالة')}
                        </button>
                      </div>
                      {couponAmount === 0 && (
                        <p className="text-xs text-accent-gold font-medium mt-2">
                          {coupon.type === 'bogo'
                            ? t('1 alana 1 bedava kodunuz hazır: sepetinize bir ürün daha ekleyin, ucuz olan ürün bedava olsun.', 'Your buy 1 get 1 free code is ready: add one more item and the cheaper one is free.', 'رمزك جاهز: أضف منتجًا آخر ويصبح الأرخص مجانًا.')
                            : isDealer
                              ? t('Bayi fiyatlarında indirim kodu uygulanmaz.', 'Discount codes do not apply to dealer prices.', 'لا تُطبَّق رموز الخصم على أسعار الوكلاء.')
                              : t('Bu kod mevcut sepetinize indirim sağlamıyor.', 'This code gives no discount on your current cart.', 'هذا الرمز لا يمنح خصمًا على سلتك الحالية.')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                  <div className="flex gap-2 mb-6">
                    <input 
                      type="text" 
                      placeholder={t('İndirim Kodu (Yapay Zeka vb.)', 'Discount code', 'رمز الخصم')} 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-background border border-foreground/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-gold"
                    />
                    <button 
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-accent-gold transition-colors"
                    >
                      {t("Uygula", "Apply", "تطبيق")}
                    </button>
                  </div>
                  {error && <p className="text-accent-rose text-xs mt-[-16px] mb-4">{error}</p>}
                    </>
                  )}

                  <div className="mb-4">
                    <PerksBanner compact />
                  </div>

                  {maxPotentialSaving > 0 && (
                    <Link
                      href="/katalog"
                      onClick={() => setIsCartOpen(false)}
                      className="mb-4 flex items-center gap-3 rounded-xl border border-accent-gold/50 bg-accent-gold/10 px-4 py-3 hover:bg-accent-gold/20 transition-colors"
                    >
                      <Percent size={18} className="text-accent-gold flex-shrink-0" />
                      <span className="text-xs leading-snug text-foreground">
                        <strong>{t("2. ürün %50 indirimli!", "2nd item 50% off!", "المنتج الثاني بخصم 50%!")}</strong>{' '}
                        {t(`Sepetinize bir ürün daha ekleyin, en fazla ${money(maxPotentialSaving)} tasarruf edin.`, `Add one more item and save up to ${money(maxPotentialSaving)}.`, `أضف منتجًا آخر ووفّر حتى ${money(maxPotentialSaving)}.`)}
                      </span>
                    </Link>
                  )}

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-foreground/60">
                      <span>{t("Ara Toplam", "Subtotal", "المجموع الفرعي")}</span>
                      <span>{money(totalAmount)}</span>
                    </div>
                    {multiItemDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span className="flex items-center gap-2"><Percent size={14} /> {t("2. Ürün %50 İndirim", "2nd item 50% off", "خصم 50% على المنتج الثاني")}</span>
                        <span>-{money(multiItemDiscount)}</span>
                      </div>
                    )}
                    {FREE_SHIPPING_FOR_ALL && lang === 'tr' && (
                      <div className="flex justify-between text-foreground/60">
                        <span>{t("Kargo", "Shipping", "الشحن")}</span>
                        <span className="text-accent-gold font-medium flex items-center gap-1"><Truck size={14} /> {t("ÜCRETSİZ", "FREE", "مجاني")}</span>
                      </div>
                    )}
                    {couponAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>{coupon?.type === 'bogo' ? t('1 Alana 1 Bedava', 'Buy 1 Get 1 Free', 'اشترِ 1 واحصل على 1 مجانًا') : coupon?.type === 'percentage' ? `${t('İndirim', 'Discount', 'خصم')} (%${coupon.value})` : t('İndirim', 'Discount', 'خصم')}</span>
                        <span>-{money(couponAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-foreground/10">
                      <span>{t("Toplam", "Total", "الإجمالي")}</span>
                      <span>{money(finalAmount)}</span>
                    </div>
                    {multiItemDiscount > 0 && (
                      <p className="text-xs text-green-600 font-medium text-right">{t(`Bu siparişte ${money(multiItemDiscount)} tasarruf ediyorsunuz`, `You save ${money(multiItemDiscount)} on this order`, `توفّر ${money(multiItemDiscount)} في هذا الطلب`)}</p>
                    )}
                  </div>

                  <button 
                    onClick={checkout}
                    className="w-full py-4 bg-foreground text-background rounded-full font-medium tracking-wide hover:bg-accent-gold transition-colors flex items-center justify-center gap-2"
                  >
                    {t("Sepete Git ve Ödemeye Geç", "Go to Cart & Checkout", "انتقل إلى السلة والدفع")}
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
