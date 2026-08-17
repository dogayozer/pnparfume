// @ts-nocheck
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, X, MessageSquare, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // 'initial' | 'wizard' | 'similar' | 'chat'
  const [flowMode, setFlowMode] = useState('initial')
  const [wizardFilters, setWizardFilters] = useState({ gender: '', family: '' })
  const [wizardProducts, setWizardProducts] = useState<any[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const addWizardStep = (step: string) => {
    if (step === 'gender') {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'wizard',
        content: 'Kimin için bir parfüm arıyoruz?',
        options: ['Kadın', 'Erkek', 'Unisex', 'Farketmez'],
        step: 'gender'
      }])
    } else if (step === 'family') {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'wizard',
        content: 'Hangi koku ailesi size daha çekici geliyor?',
        options: ['Çiçeksi', 'Odunsu', 'Oryantal', 'Ferah / Narenciye', 'Baharatlı', 'Gurme / Tatlı', 'Farketmez'],
        step: 'family'
      }])
    } else if (step === 'refinement') {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'wizard',
        content: 'Sonuçları daraltmak ister misiniz?',
        options: [
          'Sonuçları Katalogda İncele',
          'Mevsim: Kış', 
          'Mevsim: Yaz', 
          'Etkinlik: Gece / Davet', 
          'Etkinlik: Günlük', 
          'Etkinlik: Spor', 
          'Karakter: Çekici / Seksi', 
          'Karakter: Ferah / Temiz', 
          'Filtreleme İstemiyorum'
        ],
        step: 'refinement'
      }])
    }
  }

  const handleWizardSelect = async (step: string, value: string) => {
    // Hide options of the selected step
    setMessages(prev => prev.map(m => m.step === step ? { ...m, options: [] } : m))
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: value }])

    if (step === 'did_you_mean') {
      const suggestionMsg = messages.find(m => m.step === 'did_you_mean')
      if (value === 'Evet' && suggestionMsg?.suggestion) {
        setFlowMode('similar')
        handleSubmit(undefined, suggestionMsg.suggestion)
      } else {
        setFlowMode('initial')
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Anladım. Rica etsem aradığınızı biraz daha detaylı tarif edebilir misiniz?' }])
      }
      return
    }

    if (step === 'show_results') {
      if (value === 'Sonuçları Gör') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'İşte size özel önerilerimiz:',
          toolResults: wizardProducts.length > 0 ? [{ toolName: 'searchProducts', result: wizardProducts }] : []
        }])
        
        if (wizardProducts.length > 0) {
           setTimeout(() => addWizardStep('refinement'), 800)
        } else {
           setFlowMode('initial')
        }
      }
      return
    }

    if (step === 'refinement') {
      if (value === 'Filtreleme İstemiyorum') {
        setFlowMode('initial')
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Harika! Yukarıdaki listeden beğendiğiniz ürünleri detaylı inceleyebilirsiniz. Başka bir konuda yardımcı olabilir miyim?' }])
        return
      }

      if (value === 'Sonuçları Katalogda İncele') {
        const queryParams = new URLSearchParams()
        if (wizardFilters.gender && wizardFilters.gender !== 'Farketmez') {
          queryParams.append('gender', wizardFilters.gender)
        }
        if (wizardFilters.family && wizardFilters.family !== 'Farketmez') {
          queryParams.append('family', wizardFilters.family.split('/')[0].trim())
        }
        window.location.href = `/katalog?${queryParams.toString()}`
        return
      }

      // Lokal Filtreleme (Sıfır LLM, Sıfır Backend)
      let filtered = [...wizardProducts]
      const valLower = value.toLowerCase()

      if (valLower.includes('kış')) filtered = filtered.filter(p => p.season_tag?.toLowerCase().includes('kış') || p.season_tag?.toLowerCase().includes('sonbahar'))
      else if (valLower.includes('yaz')) filtered = filtered.filter(p => p.season_tag?.toLowerCase().includes('yaz') || p.season_tag?.toLowerCase().includes('ilkbahar'))
      else if (valLower.includes('gece')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('gece') || p.occasion_tag?.toLowerCase().includes('davet'))
      else if (valLower.includes('günlük')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('günlük') || p.occasion_tag?.toLowerCase().includes('ofis'))
      else if (valLower.includes('spor')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('spor') || p.occasion_tag?.toLowerCase().includes('dinamik'))
      else if (valLower.includes('çekici')) filtered = filtered.filter(p => p.mood_tag?.toLowerCase().includes('çekici') || p.mood_tag?.toLowerCase().includes('seksi') || p.mood_tag?.toLowerCase().includes('etkileyici'))
      else if (valLower.includes('ferah')) filtered = filtered.filter(p => p.mood_tag?.toLowerCase().includes('ferah') || p.mood_tag?.toLowerCase().includes('temiz') || p.mood_tag?.toLowerCase().includes('enerjik'))

      // Eğer çok fazla daralttıysa ve ürün kalmadıysa
      if (filtered.length === 0) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: `Maalesef "${value}" filtresine uyan ürün kalmadı. Bir önceki listedeki ürünlere göz atabilirsiniz.`
        }])
        setTimeout(() => addWizardStep('refinement'), 500)
        return
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `İşte "${value}" kriterine göre daraltılmış sonuçlar:`,
        toolResults: [{ toolName: 'searchProducts', result: filtered }]
      }])
      
      // Tekrar daraltma imkanı sun
      setTimeout(() => addWizardStep('refinement'), 500)
      return
    }

    const updatedFilters = { ...wizardFilters }

    if (step === 'gender') {
      updatedFilters.gender = value
      setWizardFilters(updatedFilters)
      setTimeout(() => addWizardStep('family'), 300)
    } else if (step === 'family') {
      updatedFilters.family = value
      setWizardFilters(updatedFilters)
      
      // CALL WIZARD MATCH API
      setIsLoading(true)
      try {
        const res = await fetch('/api/wizard-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: updatedFilters })
        })
        const data = await res.json()
        
        setWizardProducts(data.products || [])

        if (data.products && data.products.length > 0) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'wizard',
            content: data.text || `Aramanıza uygun ${data.products.length} ürünümüz var.`,
            options: ['Sonuçları Gör'],
            step: 'show_results'
          }])
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.text || 'Maalesef bu kriterlere uygun ürün bulamadık.',
            toolResults: []
          }])
          setFlowMode('initial')
        }

      } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Üzgünüm, sonuçları getirirken bir hata oluştu.' }])
        setFlowMode('initial')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInitialAction = (action: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: action }])
    
    if (action === 'Adım Adım Parfüm Öner') {
      setFlowMode('wizard')
      setTimeout(() => addWizardStep('gender'), 300)
    } else if (action === 'Benzer Bir Koku Arıyorum') {
      setFlowMode('similar')
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Lütfen aradığınız kokuyu tarif edin veya sevdiğiniz bir parfüm adı yazın.' }])
    } else {
      setFlowMode('chat')
      handleSubmit(undefined, action)
    }
  }

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault()
    
    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading) return
    
    const lowerText = textToSend.toLowerCase()
    
    // Niyet Yakalama (Intent Interception)
    // Eğer kullanıcı manuel olarak "öner" yazarsa sihirbazı başlat
    if (flowMode === 'initial' || flowMode === 'chat') {
      const isWizardIntent = /öner|oner|tavsiye|tavsıye|hangi parfüm|hangi parfum|koku seç|koku sec|yardım|yardim/i.test(lowerText) && !/gibi|benzer|muadil/i.test(lowerText)
      const isSimilarIntent = /gibi|benzer|muadil/i.test(lowerText)

      if (isWizardIntent) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: textToSend }])
        setInput('')
        setFlowMode('wizard')
        setTimeout(() => addWizardStep('gender'), 300)
        return
      }
      
      if (isSimilarIntent) {
        setFlowMode('similar')
        // Doğrudan backend'e "similar" olarak gitmesi için flowMode'u similar yapıp aşağıdan devam etmesine izin veriyoruz
        // Veya daha iyisi, similar match endpointine gönderelim:
      }
    }

    const newMessages = [...messages, { id: Date.now().toString(), role: 'user', content: textToSend }]
    setMessages(newMessages)
    if (!customInput) setInput('')
    setIsLoading(true)
    
    try {
      const endpoint = flowMode === 'chat' ? '/api/chat' : '/api/similar-match'
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({ role: m.role, content: m.content })).filter(m => m.role === 'user' || m.role === 'assistant')
        })
      })
      
      const data = await res.json()
      
      if (data.type === 'did_you_mean') {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'wizard',
          content: data.text,
          options: ['Evet', 'Hayır'],
          step: 'did_you_mean',
          suggestion: data.suggestion
        }
        setMessages(prev => [...prev, assistantMessage])
        // Akışa devam etmesi için flowMode sıfırlanmıyor
      } else {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text,
          toolResults: data.products ? [{ toolName: 'searchProducts', result: data.products }] : data.toolResults || []
        }
        setMessages(prev => [...prev, assistantMessage])
        if (flowMode === 'similar') {
          setFlowMode('initial')
        }
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen tekrar deneyin.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([])
    setFlowMode('initial')
    setWizardFilters({ gender: '', family: '' })
    setWizardProducts([])
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
              <div className="flex items-center gap-2">
                <button 
                  onClick={resetChat}
                  className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-background/20 hover:bg-background/30 transition-colors"
                >
                  Sıfırla
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
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
                      Merhaba! Ben Aura. Sizin için en uygun parfümü bulmak üzere buradayım. Nasıl ilerlemek istersiniz?
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <button 
                      onClick={() => handleInitialAction('Adım Adım Parfüm Öner')}
                      className="w-full text-left px-4 py-3 bg-background border border-foreground/10 rounded-xl text-sm font-medium hover:border-accent-gold transition-colors flex items-center justify-between group"
                    >
                      <span>Adım Adım Parfüm Öner</span>
                      <ArrowRight size={14} className="text-foreground/40 group-hover:text-accent-gold transition-colors" />
                    </button>
                    <button 
                      onClick={() => handleInitialAction('Benzer Bir Koku Arıyorum')}
                      className="w-full text-left px-4 py-3 bg-background border border-foreground/10 rounded-xl text-sm font-medium hover:border-accent-gold transition-colors flex items-center justify-between group"
                    >
                      <span>Benzer Bir Koku Arıyorum</span>
                      <ArrowRight size={14} className="text-foreground/40 group-hover:text-accent-gold transition-colors" />
                    </button>
                  </div>
                </div>
              )}

              {messages.map(m => (
                <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${m.role === 'user' ? 'bg-foreground/10' : ''}`}>
                    {m.role === 'user' ? <User size={14} /> : <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover" />}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-foreground/5 rounded-tr-sm' : 'bg-background border border-foreground/10 shadow-sm rounded-tl-sm'}`}>
                    {m.content && (
                       m.content.includes('https://') ? (
                          <p className="mb-2">
                             {m.content.split(/(https:\/\/[^\s]+)/g).map((part, i) => 
                                part.startsWith('https://') 
                                ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-accent-gold underline underline-offset-2 break-all">{part}</a>
                                : part
                             )}
                          </p>
                       ) : (
                          <p className="mb-2">{m.content}</p>
                       )
                    )}
                    
                    {/* Wizard Options UI */}
                    {m.role === 'wizard' && m.options && m.options.length > 0 && (
                      <div className="flex flex-col gap-2 mt-3">
                        {m.options.map((opt: string) => (
                          <button
                            key={opt}
                            onClick={() => handleWizardSelect(m.step, opt)}
                            className="text-left px-3 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg text-xs font-medium transition-colors"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tool UI */}
                    {m.toolResults?.map((tr: any, idx: number) => {
                      const resultData = tr.result || tr.output || tr;
                      if (tr.toolName === 'searchProducts') {
                        return (
                          <div key={idx} className="mt-3 p-3 bg-foreground/5 rounded-xl border border-foreground/10">
                            <p className="text-[10px] font-medium text-accent-gold mb-2 tracking-widest uppercase">Önerilen Parfümler ({Array.isArray(resultData) ? resultData.length : 0})</p>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                              {Array.isArray(resultData) && resultData.length > 0 ? resultData.map((prod: any) => (
                                <Link key={prod.sku} href={`/urun/${prod.sku}`} className="block p-2 bg-background rounded-md hover:border-accent-rose border border-transparent transition-colors text-xs shadow-sm">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">PN {prod.sku}</span>
                                    <span className="text-[9px] uppercase font-bold text-accent-gold tracking-widest">{prod.gender}</span>
                                  </div>
                                  <div className="text-[10px] text-foreground/60 line-clamp-1">{prod.families?.join(', ') || prod.fragrance_family?.join(', ')}</div>
                                </Link>
                              )) : <div className="text-xs text-foreground/60">Ürün bulunamadı.</div>}
                            </div>
                          </div>
                        )
                      }
                      return null
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
            <div className={`p-3 bg-background border-t border-foreground/10 transition-all duration-300 ${flowMode === 'wizard' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <form id="chat-widget-form" onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={flowMode === 'wizard' ? "Lütfen yukarıdan seçim yapın" : "Mesajınızı yazın..."}
                  disabled={flowMode === 'wizard'}
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-accent-rose/50 transition-colors disabled:bg-foreground/5"
                  style={{ touchAction: 'manipulation' }}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !(input || '').trim() || flowMode === 'wizard'}
                  className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent-rose transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
      `}} />
    </>
  )
}
