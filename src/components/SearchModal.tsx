'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Meilisearch } from 'meilisearch'
import Link from 'next/link'

// We only initialize the client if keys are present, so it doesn't crash if they haven't set it up yet.
const getMeiliClient = () => {
  if (process.env.NEXT_PUBLIC_MEILISEARCH_HOST && process.env.NEXT_PUBLIC_MEILISEARCH_KEY) {
    return new Meilisearch({
      host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST,
      apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY,
    })
  }
  return null
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const search = async () => {
      const client = getMeiliClient()
      if (!client || query.length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const index = client.index('products')
        const res = await index.search(query, { limit: 5 })
        setResults(res.hits)
      } catch (error) {
        console.error("Meilisearch error:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 border-b border-foreground/5">
              <Search size={20} className="text-foreground/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Parfüm adı, SKU veya koku ailesi ara..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-lg font-light text-foreground placeholder:text-foreground/30"
              />
              <button onClick={onClose} className="p-2 text-foreground/40 hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((hit) => (
                    <Link
                      key={hit.id}
                      href={`/urun/${hit.sku}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <div>
                        <div className="font-medium group-hover:text-accent-rose transition-colors">{hit.name}</div>
                        <div className="text-xs text-foreground/50 mt-1 flex gap-3">
                          <span>SKU: {hit.sku}</span>
                          {hit.family && <span>Aile: {hit.family}</span>}
                        </div>
                      </div>
                      <span className="text-sm text-foreground/40 group-hover:text-foreground transition-colors">Detay &rarr;</span>
                    </Link>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="py-12 text-center text-foreground/40">
                  "{query}" için sonuç bulunamadı.
                </div>
              ) : (
                <div className="py-12 text-center text-foreground/20 text-sm">
                  Aramaya başlamak için en az 2 karakter girin.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
