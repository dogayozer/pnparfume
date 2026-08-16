'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  sku: string
  name: string
  price: number
  quantity: number
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

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pn_cart')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('pn_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.sku === item.sku)
      if (existing) {
        return prev.map(i => i.sku === item.sku ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (sku: string) => {
    setItems(prev => prev.filter(i => i.sku !== sku))
  }

  const clearCart = () => setItems([])

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
