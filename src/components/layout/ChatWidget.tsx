// @ts-nocheck
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, X, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const quickActions = [
    "Bana parfüm öner",
    "Benzer bir koku arıyorum",
    "İndirim kodu istiyorum"
  ]

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault()
    
    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading) return
    
    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: textToSend }]
    setMessages(newMessages)
    if (!customInput) setInput('')
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      })
      
      const rawText = await res.text()
      const data = JSON.parse(rawText)
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        toolResults: data.toolResults || []
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen tekrar deneyin.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    handleSubmit(undefined, action)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-4 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-[60] overflow-hidden border-[3px] border-background ${isOpen ? 'hidden' : 'flex'}`}
      >
        <img src="/aura-avatar.jpg" alt="Aura AI Chat" className="w-full h-full object-cover" />
      </button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 w-full h-[70vh] md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:max-h-[80vh] bg-background border border-foreground/10 rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-foreground text-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-background/20 flex items-center justify-center">
                  <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Aura - Yapay Zeka Uzmanı</h3>
                  <p className="text-[10px] text-background/60">Aktif, size yardımcı olmaya hazır.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-foreground/[0.02]">
              {messages.length === 0 && (
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-background border border-foreground/10 shadow-sm rounded-2xl rounded-tl-sm p-3 text-sm">
                      Merhaba! Ben Aura. PN Parfüm'ün yapay zeka destekli yardımcınızım. Aradığınız kokunuzu bulmanıza yardımcı olabilirim. Nasıl yardımcı olabilirim?
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {quickActions.map(action => (
                      <button 
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="px-3 py-1.5 bg-background border border-foreground/10 rounded-full text-xs font-medium hover:border-accent-gold transition-colors text-foreground/80"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(m => (
                <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${m.role === 'user' ? 'bg-foreground/10' : ''}`}>
                    {m.role === 'user' ? <User size={14} /> : <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-foreground/5 rounded-tr-sm' : 'bg-background border border-foreground/10 shadow-sm rounded-tl-sm'}`}>
                    {m.content}
                    
                    {/* Tool UI */}
                    {m.toolResults?.map((tr: any, idx: number) => {
                      if (tr.toolName === 'searchProducts') {
                        return (
                          <div key={idx} className="mt-3 p-3 bg-foreground/5 rounded-xl border border-foreground/10">
                            <p className="text-[10px] font-medium text-accent-gold mb-2 tracking-widest uppercase">Bulunan Parfümler</p>
                            <div className="space-y-2">
                              {Array.isArray(tr.result) && tr.result.length > 0 ? tr.result.map((prod: any) => (
                                <Link key={prod.sku} href={`/urun/${prod.sku}`} className="block p-2 bg-background rounded-md hover:border-accent-rose border border-transparent transition-colors text-xs">
                                  <div className="font-medium">PN {prod.sku}</div>
                                  <div className="text-[10px] text-foreground/60 line-clamp-1">{prod.mood_tag}</div>
                                </Link>
                              )) : <div className="text-xs text-foreground/60">Ürün bulunamadı.</div>}
                            </div>
                          </div>
                        )
                      }
                      if (tr.toolName === 'generateDiscount') {
                        return (
                          <div key={idx} className="mt-3 p-3 bg-accent-rose/10 rounded-xl border border-accent-rose/20 text-center">
                             <div className="text-[10px] font-medium text-accent-rose mb-1 uppercase tracking-widest">Özel İndirim</div>
                             <div className="text-lg font-bold tracking-widest">{tr.result?.code}</div>
                             <div className="text-xs mt-1 opacity-80">%{tr.result?.discountPercentage} İndirim</div>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                      <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover opacity-50 animate-pulse" />
                    </div>
                    <div className="bg-background border border-foreground/10 shadow-sm rounded-2xl rounded-tl-sm p-3 flex gap-1 items-center h-10">
                       <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce delay-100"></span>
                       <span className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce delay-200"></span>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-background border-t border-foreground/10">
              <form id="chat-widget-form" onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Bana bir koku tarif edin..."
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-accent-rose/50 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !(input || '').trim()}
                  className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent-rose transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
