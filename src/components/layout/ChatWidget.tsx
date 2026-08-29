// @ts-nocheck
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, X, MessageSquare, Plus, ArrowRight, ShoppingBag, Check, Copy, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/contexts/CartContext'

// Mesaj ID üretici: sadece Date.now().toString() kullanmak, aynı milisaniye içinde
// art arda oluşturulan mesajların (örn. "wizard" adımlarının otomatik eklenmesi)
// AYNI id'yi almasına yol açıyordu — React'te "duplicate key" uyarısına ve
// mesajların birbirinin yerine geçmesi riskine sebep olan asıl neden buydu.
// Sayaç + zaman damgası birlikte her çağrıda benzersiz bir id garanti eder.
let msgIdCounter = 0
const genId = () => `${Date.now()}-${msgIdCounter++}`

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [addedSku, setAddedSku] = useState<string | null>(null)
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)
  
  // 'initial' | 'wizard' | 'similar' | 'chat'
  const [flowMode, setFlowMode] = useState('initial')
  const [wizardFilters, setWizardFilters] = useState({ gender: '', family: '' })
  const [wizardProducts, setWizardProducts] = useState<any[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addToCart, setIsCartOpen } = useCart()

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleAddToCart = (prod: any) => {
    addToCart({
      sku: prod.sku,
      name: `PN ${prod.sku}`,
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

  const addWizardStep = (step: string) => {
    if (step === 'gender') {
      setMessages(prev => [...prev, {
        id: genId(),
        role: 'wizard',
        content: 'Kimin için bir parfüm arıyoruz?',
        options: ['Kadın', 'Erkek', 'Unisex', 'Farketmez'],
        step: 'gender'
      }])
    } else if (step === 'family') {
      setMessages(prev => [...prev, {
        id: genId(),
        role: 'wizard',
        content: 'Hangi koku ailesi size daha çekici geliyor?',
        options: ['Çiçeksi', 'Odunsu', 'Oryantal', 'Ferah / Narenciye', 'Baharatlı', 'Gurme / Tatlı', 'Farketmez'],
        step: 'family'
      }])
    } else if (step === 'refinement') {
      setMessages(prev => [...prev, {
        id: genId(),
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
    setMessages(prev => [...prev, { id: genId(), role: 'user', content: value }])

    if (step === 'did_you_mean') {
      const suggestionMsg = messages.find(m => m.step === 'did_you_mean')
      if (value === 'Evet' && suggestionMsg?.suggestion) {
        setFlowMode('similar')
        // Kısa bir "aranıyor" anı — gerçek bir gecikme değil, arka planda sonuç
        // zaten kendi kataloğumuzdan LLM'siz geliyor, sadece kullanıcıya bir
        // arama hissi veriyor.
        setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Kütüphanemizde koku profilini arıyorum...' }])
        setTimeout(() => handleSubmit(undefined, suggestionMsg.suggestion, 'Evet, doğru.', suggestionMsg.language), 800)
      } else {
        setFlowMode('initial')
        setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Anladım. Rica etsem aradığınızı biraz daha detaylı tarif edebilir misiniz?' }])
      }
      return
    }

    if (step === 'show_results') {
      if (value === 'Sonuçları Gör') {
        setMessages(prev => [...prev, {
          id: genId(),
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
        setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Harika! Yukarıdaki listeden beğendiğiniz ürünleri detaylı inceleyebilirsiniz. Başka bir konuda yardımcı olabilir miyim?' }])
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

      // Local filter
      let filtered = [...wizardProducts]
      const valLower = value.toLowerCase()

      if (valLower.includes('kış')) filtered = filtered.filter(p => p.season_tag?.toLowerCase().includes('kış') || p.season_tag?.toLowerCase().includes('sonbahar'))
      else if (valLower.includes('yaz')) filtered = filtered.filter(p => p.season_tag?.toLowerCase().includes('yaz') || p.season_tag?.toLowerCase().includes('ilkbahar'))
      else if (valLower.includes('gece')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('gece') || p.occasion_tag?.toLowerCase().includes('davet'))
      else if (valLower.includes('günlük')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('günlük') || p.occasion_tag?.toLowerCase().includes('ofis'))
      else if (valLower.includes('spor')) filtered = filtered.filter(p => p.occasion_tag?.toLowerCase().includes('spor') || p.occasion_tag?.toLowerCase().includes('dinamik'))
      else if (valLower.includes('çekici')) filtered = filtered.filter(p => p.mood_tag?.toLowerCase().includes('çekici') || p.mood_tag?.toLowerCase().includes('seksi') || p.mood_tag?.toLowerCase().includes('etkileyici'))
      else if (valLower.includes('ferah')) filtered = filtered.filter(p => p.mood_tag?.toLowerCase().includes('ferah') || p.mood_tag?.toLowerCase().includes('temiz') || p.mood_tag?.toLowerCase().includes('enerjik'))

      if (filtered.length === 0) {
        setMessages(prev => [...prev, { 
          id: genId(), 
          role: 'assistant', 
          content: `Maalesef "${value}" filtresine uyan ürün kalmadı. Bir önceki listedeki ürünlere göz atabilirsiniz.`
        }])
        setTimeout(() => addWizardStep('refinement'), 500)
        return
      }

      setMessages(prev => [...prev, {
        id: genId(),
        role: 'assistant',
        content: `İşte "${value}" kriterine göre daraltılmış sonuçlar:`,
        toolResults: [{ toolName: 'searchProducts', result: filtered }]
      }])
      
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
            id: genId(),
            role: 'wizard',
            content: data.text || `Aramanıza uygun ${data.products.length} ürünümüz var.`,
            options: ['Sonuçları Gör'],
            step: 'show_results'
          }])
        } else {
          setMessages(prev => [...prev, {
            id: genId(),
            role: 'assistant',
            content: data.text || 'Maalesef bu kriterlere uygun ürün bulamadık.',
            toolResults: []
          }])
          setFlowMode('initial')
        }

      } catch (error) {
        setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Üzgünüm, sonuçları getirirken bir hata oluştu.' }])
        setFlowMode('initial')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInitialAction = (action: string) => {
    setMessages(prev => [...prev, { id: genId(), role: 'user', content: action }])
    
    if (action === 'Adım Adım Parfüm Öner') {
      setFlowMode('wizard')
      setTimeout(() => addWizardStep('gender'), 300)
    } else if (action === 'Benzer Bir Koku Arıyorum') {
      setFlowMode('similar')
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Lütfen aradığınız kokuyu tarif edin veya sevdiğiniz bir parfüm adı yazın.' }])
    } else {
      setFlowMode('chat')
      handleSubmit(undefined, action)
    }
  }

  const handleSubmit = async (e?: React.FormEvent, customInput?: string, displayOverride?: string, langOverride?: string) => {
    if (e) e.preventDefault()

    const textToSend = customInput || input
    if (!textToSend.trim() || isLoading) return

    const lowerText = textToSend.toLowerCase()

    // targetFlowMode: setFlowMode(...) bu fonksiyon çağrısı SIRASINDA senkron olarak
    // okunamıyor — React state güncellemesi bir sonraki render'a kadar closure'daki
    // `flowMode`'u değiştirmiyor. Aşağıdaki endpoint seçimi bu yüzden `flowMode`
    // state'i yerine bu local değişkeni kullanmalı (aksi halde ilk "chat" moduna
    // geçişte istek yanlışlıkla /api/similar-match'e gidiyordu).
    let targetFlowMode = flowMode

    // Intent Interception
    if (flowMode === 'initial' || flowMode === 'chat') {
      const isWizardIntent = /öner|oner|tavsiye|tavsıye|hangi parfüm|hangi parfum|koku seç|koku sec|yardım|yardim/i.test(lowerText) && !/gibi|benzer|muadil/i.test(lowerText)
      const isSimilarIntent = /gibi|benzer|muadil/i.test(lowerText)

      if (isWizardIntent) {
        setMessages(prev => [...prev, { id: genId(), role: 'user', content: textToSend }])
        setInput('')
        setFlowMode('wizard')
        setTimeout(() => addWizardStep('gender'), 300)
        return
      }

      if (isSimilarIntent) {
        targetFlowMode = 'similar'
        setFlowMode('similar')
      } else if (flowMode === 'initial') {
        // Genel bir soru/quick action — serbest sohbet moduna geçiyoruz, bu istek /api/chat'e gitmeli.
        targetFlowMode = 'chat'
        setFlowMode('chat')
      }
    }

    // Backend'e her zaman GERÇEK metin gönderilir (fast-path eşleştirmesi için — örn.
    // "Evet" onayında marka adı taşıyan suggestion). Ekranda gösterilen balon farklı
    // olabilir (displayOverride) — müşteriye marka adı asla gösterilmez (telif kuralı).
    const sentMessageId = genId()
    const newMessages = [...messages, { id: sentMessageId, role: 'user', content: textToSend }]
    setMessages(displayOverride
      ? [...messages, { id: sentMessageId, role: 'user', content: displayOverride }]
      : newMessages)
    if (!customInput) setInput('')
    setIsLoading(true)
    
    // Giriş yapmış müşteriyi Aura'ya tanıtmak için — CartContext'in de kullandığı
    // localStorage 'user' anahtarından okunuyor. Anonim ziyaretçide null gider,
    // backend bu durumda hiçbir özel bilgi uydurmuyor (bkz. api/chat/route.ts).
    let loggedInUserId: string | null = null
    let sessionToken: string | null = null
    try {
      const rawUser = localStorage.getItem('user')
      if (rawUser) loggedInUserId = JSON.parse(rawUser)?.id || null
      sessionToken = localStorage.getItem('pn_session')
    } catch { /* localStorage okunamadı, anonim devam et */ }

    try {
      const endpoint = targetFlowMode === 'chat' ? '/api/chat' : '/api/similar-match'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aura, userId ile kişiselleştirilmiş bilgi (isim/cüzdan/referans kodu)
          // vereceği için, o userId'nin gerçekten bu oturuma ait olduğunu bu token
          // ile kanıtlıyoruz (bkz. api/chat/route.ts).
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })).filter(m => m.role === 'user' || m.role === 'assistant'),
          userId: loggedInUserId,
          lang: langOverride
        })
      })

      if (endpoint === '/api/chat') {
        // /api/chat standart JSON değil, NDJSON (satır başına bir JSON nesnesi) akışı
        // döner: {"type":"token","value":...} satırları ve son olarak
        // {"type":"done","toolResults":[...]}. Tek seferde JSON.parse etmeye çalışmak
        // (aşağıdaki similar-match dalındaki gibi) burada her zaman başarısız olur.
        const rawText = await res.text()
        let assembledText = ''
        let toolResults: any[] = []
        for (const line of rawText.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed) continue
          try {
            const evt = JSON.parse(trimmed)
            if (evt.type === 'token') assembledText += evt.value
            else if (evt.type === 'done') toolResults = evt.toolResults || []
          } catch { /* bozuk/parçalı satır, atla */ }
        }
        setMessages(prev => [...prev, {
          id: genId(),
          role: 'assistant',
          content: assembledText,
          toolResults
        }])
        if (targetFlowMode === 'similar') {
          setFlowMode('initial')
        }
      } else {
        const rawText = await res.text()
        let data: any = {}
        try {
          data = JSON.parse(rawText.trim())
        } catch {
          data = { text: rawText }
        }

        if (data.type === 'did_you_mean') {
          const assistantMessage = {
            id: genId(),
            role: 'wizard',
            content: data.text,
            options: ['Evet', 'Hayır'],
            step: 'did_you_mean',
            suggestion: data.suggestion,
            language: data.language
          }
          setMessages(prev => [...prev, assistantMessage])
        } else {
          const assistantMessage = {
            id: genId(),
            role: 'assistant',
            content: data.text,
            toolResults: data.products ? [{ toolName: 'searchProducts', result: data.products }] : data.toolResults || []
          }
          setMessages(prev => [...prev, assistantMessage])
          if (targetFlowMode === 'similar') {
            setFlowMode('initial')
          }
        }
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: genId(), role: 'assistant', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen tekrar deneyin.' }])
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
            className="fixed bottom-0 right-0 w-full h-[75vh] md:bottom-6 md:right-6 md:w-[420px] md:h-[620px] md:max-h-[82vh] bg-background border border-foreground/10 rounded-t-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-foreground text-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-background/20 flex items-center justify-center">
                  <img src="/aura-avatar.jpg" alt="Aura AI" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Aura Parfüm Danışmanınız</h3>
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
                      
                      // Search Products
                      if (tr.toolName === 'searchProducts') {
                        return (
                          <div key={idx} className="mt-3 p-3 bg-foreground/5 rounded-xl border border-foreground/10">
                            <p className="text-[10px] font-medium text-accent-gold mb-2 tracking-widest uppercase">Önerilen İmza Parfümler ({Array.isArray(resultData) ? resultData.length : 0})</p>
                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                              {Array.isArray(resultData) && resultData.length > 0 ? resultData.map((prod: any) => {
                                // Gerçek fotoğraf yoksa (prod.image null), ürünle alakasız rastgele
                                // bir görsel (eski "kasap" placeholder seti) göstermek yerine SKU
                                // yazılı zarif bir çerçeve gösterilir.
                                const prodImgSrc = prod.image
                                  ? (prod.image.startsWith('http://parfumtasarla.com') || prod.image.startsWith('http://kasaptanetyiyelim.com')
                                      ? `/api/media-proxy?url=${encodeURIComponent(prod.image)}`
                                      : prod.image)
                                  : null
                                return (
                                  <div key={prod.sku} className="p-2.5 bg-background rounded-xl border border-foreground/10 flex items-center justify-between gap-2 shadow-sm">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 bg-foreground/5 flex items-center justify-center">
                                        {prodImgSrc ? (
                                          <Image src={prodImgSrc} alt={prod.sku} fill className="object-cover" />
                                        ) : (
                                          <span className="text-foreground/20 font-light text-[8px] tracking-widest">{prod.sku}</span>
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <Link href={`/urun/${prod.sku}`} className="font-bold text-foreground hover:text-accent-gold transition-colors text-xs truncate block">
                                          PN {prod.sku}
                                        </Link>
                                        <span className="text-[10px] text-foreground/50 truncate block">{prod.mood_tag || prod.fragrance_family?.[0] || 'İmza Koku'}</span>
                                        <span className="text-[11px] font-semibold text-accent-gold block">{prod.price || 850} TL</span>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleAddToCart(prod)}
                                      className={`p-2 rounded-lg text-[10px] font-semibold transition-colors flex items-center gap-1 flex-shrink-0 ${
                                        addedSku === prod.sku 
                                          ? 'bg-emerald-600 text-white' 
                                          : 'bg-foreground text-background hover:bg-accent-gold'
                                      }`}
                                      title="Sepete Ekle"
                                    >
                                      {addedSku === prod.sku ? <Check size={12} /> : <ShoppingBag size={12} />}
                                      <span>{addedSku === prod.sku ? 'Eklendi' : 'Ekle'}</span>
                                    </button>
                                  </div>
                                )
                              }) : <div className="text-xs text-foreground/60">Ürün bulunamadı.</div>}
                            </div>
                          </div>
                        )
                      }

                      // Generate Discount
                      if (tr.toolName === 'generateDiscount' && resultData?.code) {
                        return (
                          <div key={idx} className="mt-3 p-3 bg-gradient-to-br from-amber-500/15 to-accent-rose/15 rounded-xl border border-accent-gold/30 text-center space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-accent-gold flex items-center justify-center gap-1">
                              <Tag size={12} /> Size Özel İndirim Tanımlandı
                            </div>
                            <div className="font-mono font-bold text-base text-foreground tracking-wider">{resultData.code}</div>
                            <div className="text-[11px] text-foreground/70 font-medium">%{resultData.discountPercentage} Anında İndirim</div>
                            <button
                              onClick={() => handleApplyCoupon(resultData.code)}
                              className="w-full mt-1 bg-foreground text-background py-1.5 rounded-lg text-[11px] font-semibold hover:bg-accent-gold transition-colors flex items-center justify-center gap-1 shadow-sm"
                            >
                              {copiedCoupon === resultData.code ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedCoupon === resultData.code ? 'Kupon Kopyalandı!' : 'Kuponu Sepete Tanımla'}</span>
                            </button>
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
                  className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-accent-rose/50 transition-colors disabled:bg-foreground/5 text-foreground"
                  style={{ touchAction: 'manipulation' }}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !(input || '').trim() || flowMode === 'wizard'}
                  className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent-gold transition-colors disabled:opacity-50 flex-shrink-0"
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
