// @ts-nocheck
'use client'

import { useChat } from '@ai-sdk/react'
import { motion } from 'framer-motion'
import { Send, Sparkles, User, Bot } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function AsistanPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-8 px-4 md:px-12 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 mb-4 border border-foreground/10">
          <Sparkles className="text-accent-gold" size={28} />
        </div>
        <h1 className="text-3xl font-light">Kişisel Koku Asistanınız</h1>
        <p className="text-foreground/50 mt-2">Karakterinize ve ruh halinize en uygun imzayı birlikte bulalım.</p>
      </div>

      <div className="flex-1 bg-foreground/[0.02] border border-foreground/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-gold rounded-full mix-blend-multiply filter blur-[96px] animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-rose rounded-full mix-blend-multiply filter blur-[96px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
          {messages.length === 0 && (
            <div className="text-center text-foreground/40 mt-12 flex flex-col items-center">
              <Bot size={32} className="mb-4 opacity-50" />
              <p>Örneğin: "Girdiğim ortamda fark edilmek istiyorum, bana ne önerirsin?"</p>
            </div>
          )}
          
          {messages.map(m => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={m.id} 
              className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-foreground/10' : 'bg-foreground text-background'}`}>
                {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-foreground/5 rounded-tr-sm' : 'bg-background border border-foreground/10 shadow-sm rounded-tl-sm'}`}>
                {m.content}
                
                {/* Tool Invocations UI */}
                {m.toolInvocations?.map(toolInvocation => {
                  const { toolName, toolCallId, state } = toolInvocation;

                  if (state === 'result') {
                    if (toolName === 'searchProducts') {
                      return (
                        <div key={toolCallId} className="mt-4 p-4 bg-foreground/5 rounded-xl border border-foreground/10">
                          <p className="text-xs font-medium text-accent-gold mb-2 tracking-widest uppercase">Bulunan Eşleşmeler</p>
                          <div className="space-y-2">
                            {/* @ts-ignore */}
                            {toolInvocation.result.map ? toolInvocation.result.map((prod: any) => (
                              <Link key={prod.sku} href={`/urun/${prod.sku}`} className="block p-3 bg-background rounded-lg hover:border-accent-rose border border-transparent transition-colors">
                                <div className="font-medium">PN {prod.sku}</div>
                                <div className="text-xs text-foreground/60">{prod.mood_tag}</div>
                              </Link>
                            )) : <div className="text-sm text-foreground/60">Ürün bulunamadı.</div>}
                          </div>
                        </div>
                      )
                    }
                    if (toolName === 'generateDiscount') {
                      return (
                        <div key={toolCallId} className="mt-4 p-4 bg-accent-rose/10 rounded-xl border border-accent-rose/20 text-center">
                           <div className="text-xs font-medium text-accent-rose mb-2 uppercase tracking-widest">Size Özel İndirim Tanımlandı</div>
                           {/* @ts-ignore */}
                           <div className="text-2xl font-bold tracking-widest">{toolInvocation.result.code}</div>
                           {/* @ts-ignore */}
                           <div className="text-sm mt-1 opacity-80">%{toolInvocation.result.discountPercentage} İndirim</div>
                        </div>
                      )
                    }
                  } else {
                    return (
                      <div key={toolCallId} className="mt-2 text-xs text-foreground/40 italic flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
                        {toolName === 'searchProducts' ? 'Koleksiyon taranıyor...' : 'İndirim hesaplanıyor...'}
                      </div>
                    )
                  }
                })}
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center">
                  <Sparkles size={16} className="animate-spin-slow" />
                </div>
                <div className="bg-background border border-foreground/10 shadow-sm rounded-2xl rounded-tl-sm p-4 flex gap-1">
                   <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-foreground/20 rounded-full animate-bounce delay-200"></span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-background/50 backdrop-blur-md border-t border-foreground/5 z-10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Nasıl bir izlenim bırakmak istersiniz?"
              className="flex-1 bg-foreground/5 border border-foreground/10 rounded-full px-6 py-4 focus:outline-none focus:border-accent-rose/50 transition-colors"
            />
            <button 
              type="submit" 
              disabled={isLoading || !(input || '').trim()}
              className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-accent-rose transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
