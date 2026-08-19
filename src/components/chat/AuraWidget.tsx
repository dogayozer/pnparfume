'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MessageCircle, X, Send, Bot, User, ShoppingBag, Check, Copy, ArrowRight, Tag, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: any[]
  coupon?: any
}

const QUICK_PROMPTS = [
  '✨ Bana parfüm öner',
  '🌙 Kalıcı gece kokusu',
  '💼 Ofis için ferah koku',
  '🎁 İndirim fırsatı var mı?'
]

export default function AuraWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Merhaba! Ben PN Parfüm Koku Uzmanı Aura. Aradığınız koku tarzını veya benzerini bulmak istediğiniz bir parfümü yazın, size özel imza kokunuzu keşfedelim ✨'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [addedSku, setAddedSku] = useState<string | null>(null)
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addToCart, setIsCartOpen } = useCart()

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input
    if (!messageText.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Build history for API
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      })

      const rawText = await res.text()
      let data: any = {}
      try {
        data = JSON.parse(rawText.trim())
      } catch {
        data = { text: rawText }
      }

      // Extract products or coupon from tool results
      let foundProducts: any[] = []
      let generatedCoupon: any = null

      if (Array.isArray(data.toolResults)) {
        for (const tool of data.toolResults) {
          if (tool.toolName === 'searchProducts' && Array.isArray(tool.result)) {
            foundProducts = tool.result
          }
          if (tool.toolName === 'generateDiscount' && tool.result?.code) {
            generatedCoupon = tool.result
          }
        }
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Size nasıl yardımcı olabilirim?',
        products: foundProducts.length > 0 ? foundProducts : undefined,
        coupon: generatedCoupon || undefined
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bağlantı sırasında küçük bir aksaklık oldu. Lütfen tekrar deneyin.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (prod: any) => {
    addToCart({
      sku: prod.sku,
      name: prod.original_name || `PN ${prod.sku}`,
      price: prod.price || 850,
      quantity: 1
    })
    setAddedSku(prod.sku)
    setTimeout(() => setAddedSku(null), 2500)
    setIsCartOpen(true)
  }

  const handleApplyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    localStorage.setItem('pn_referral_code', code)
    setCopiedCoupon(code)
    setTimeout(() => setCopiedCoupon(null), 2500)
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-foreground text-background p-4 rounded-full shadow-2xl flex items-center gap-2.5 border border-accent-gold/40 hover:border-accent-gold transition-colors"
          title="Aura Koku Asistanı"
        >
          <div className="relative">
            <Sparkles className="text-accent-gold" size={22} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
          </div>
          <span className="hidden sm:inline font-light text-xs tracking-wider pr-1 text-background">Aura AI Asistan</span>
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-background/95 backdrop-blur-xl border border-foreground/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 px-5 border-b border-foreground/10 flex items-center justify-between bg-foreground/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-gold/20 to-accent-rose/20 border border-accent-gold/30 flex items-center justify-center text-accent-gold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-foreground">Aura Koku Uzmanı</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-foreground/50 font-light">Yapay Zeka Satış & Koku Danışmanı</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setMessages([{
                    id: 'welcome',
                    role: 'assistant',
                    content: 'Sohbet sıfırlandı. Size nasıl bir koku önerebilirim? ✨'
                  }])}
                  className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                  title="Sohbeti Sıfırla"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                    m.role === 'user' ? 'bg-foreground/10 text-foreground' : 'bg-foreground text-background shadow-sm'
                  }`}>
                    {m.role === 'user' ? <User size={13} /> : <Sparkles size={13} className="text-accent-gold" />}
                  </div>

                  <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-foreground text-background rounded-tr-sm font-light' 
                      : 'bg-foreground/5 border border-foreground/10 text-foreground/90 rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>

                    {/* Recomended Products Card List */}
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-foreground/10 space-y-2">
                        <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold block mb-1">
                          ✨ Önerilen İmza Kokular
                        </span>
                        {m.products.map(prod => (
                          <div key={prod.sku} className="bg-background p-2.5 rounded-xl border border-foreground/10 flex items-center justify-between gap-2 shadow-sm hover:border-accent-gold/50 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              {prod.image ? (
                                <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-foreground/5">
                                  <Image src={prod.image} alt={prod.sku} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center text-[10px] font-mono">
                                  PN
                                </div>
                              )}
                              <div className="min-w-0">
                                <Link href={`/urun/${prod.sku}`} className="font-bold text-foreground hover:text-accent-gold transition-colors truncate block">
                                  PN {prod.sku}
                                </Link>
                                <span className="text-[10px] text-foreground/50 truncate block">{prod.mood_tag || prod.fragrance_family?.[0] || 'Özel Harman'}</span>
                                <span className="text-[11px] font-semibold text-accent-gold block">{prod.price || 850} TL</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddToCart(prod)}
                              className={`p-2 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 flex-shrink-0 ${
                                addedSku === prod.sku 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-foreground text-background hover:bg-accent-gold'
                              }`}
                              title="Sepete Ekle"
                            >
                              {addedSku === prod.sku ? <Check size={13} /> : <ShoppingBag size={13} />}
                              <span>{addedSku === prod.sku ? 'Eklendi' : 'Ekle'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Generated Coupon Card */}
                    {m.coupon && (
                      <div className="mt-3 p-3 bg-gradient-to-br from-amber-500/15 to-accent-rose/15 rounded-xl border border-accent-gold/30 text-center space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-accent-gold flex items-center justify-center gap-1">
                          <Tag size={12} /> Özel İndirim Tanımlandı
                        </div>
                        <div className="font-mono font-bold text-base text-foreground tracking-wider">{m.coupon.code}</div>
                        <div className="text-[11px] text-foreground/70 font-medium">%{m.coupon.discountPercentage} Anında İndirim</div>
                        <button
                          onClick={() => handleApplyCoupon(m.coupon.code)}
                          className="w-full mt-1 bg-foreground text-background py-1.5 rounded-lg text-[11px] font-semibold hover:bg-accent-gold transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          {copiedCoupon === m.coupon.code ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCoupon === m.coupon.code ? 'Kupon Kopyalandı!' : 'Kuponu Sepete Tanımla'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-foreground/50 italic pl-10">
                  <span className="w-2 h-2 rounded-full bg-accent-gold animate-ping" />
                  Aura koku koleksiyonunu tarıyor...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    className="whitespace-nowrap bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-foreground/70 hover:text-foreground text-[10px] px-2.5 py-1 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="p-3 border-t border-foreground/10 bg-background">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Koku tercihinizi veya bir parfüm adı yazın..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-gold transition-colors text-foreground"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-2xl bg-foreground text-background flex items-center justify-center hover:bg-accent-gold transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
