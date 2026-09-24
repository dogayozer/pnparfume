'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useDealer } from '@/contexts/DealerContext'

export interface CartItem {
  sku: string
  name: string
  price: number
  // Perakende fiyat — bayi fiyatı uygulanmış kalemlerde bayi çıkış yapınca geri dönmek için saklanır.
  retailPrice?: number
  quantity: number
  size?: string
  selectedScents?: string[]
  imageUrl?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (sku: string) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  // İlk yükleme tamamlanana kadar "kaydet" efekti localStorage'a yazmasın —
  // aksi halde başlangıçtaki boş items state'i, henüz işlenmemiş "yükle"
  // güncellemesinden önce localStorage'daki gerçek sepeti kalıcı olarak ezer
  // (bkz. checkout sonrası sepetin sıfırlanması hatası).
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pn_cart')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch (e) {}
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage and sync with account if logged in (Debounced 1500ms for Neon compute savings)
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('pn_cart', JSON.stringify(items))

    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          const sessionToken = localStorage.getItem('pn_session')
          if (user && user.id) {
            fetch('/api/user/cart-sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
              },
              body: JSON.stringify({ userId: user.id, cart: items })
            }).catch(() => {})
          }
        } catch (e) {}
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [items, isLoaded])

  // Bayi fiyatı tek noktada uygulanıyor: ürün hangi butondan eklenirse eklensin
  // (kart, ürün sayfası, sohbet asistanı) sepetteki fiyat bayi fiyatına çevrilir.
  const { isDealer, dealerPrices } = useDealer()
  const priceFor = (sku: string, retail: number) =>
    isDealer && dealerPrices[sku] != null ? dealerPrices[sku] : retail

  useEffect(() => {
    if (!isLoaded) return
    setItems(prev => {
      let changed = false
      const next = prev.map(i => {
        const retail = i.retailPrice ?? i.price
        const price = priceFor(i.sku, retail)
        if (price === i.price && i.retailPrice === retail) return i
        changed = true
        return { ...i, price, retailPrice: retail }
      })
      return changed ? next : prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isDealer, dealerPrices])

  const addToCart = (item: CartItem) => {
    const retail = item.retailPrice ?? item.price
    const priced = { ...item, retailPrice: retail, price: priceFor(item.sku, retail) }
    setItems(prev => {
      const existing = prev.find(i => i.sku === priced.sku)
      if (existing) {
        return prev.map(i => i.sku === priced.sku ? { ...i, quantity: i.quantity + priced.quantity } : i)
      }
      return [...prev, priced]
    })
  }

  const removeFromCart = (sku: string) => {
    setItems(prev => prev.filter(i => i.sku !== sku))
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem('pn_cart')
    } catch (e) {}
  }

  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, totalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
