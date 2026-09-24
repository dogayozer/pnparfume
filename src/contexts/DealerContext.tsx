'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface DealerState {
  isDealer: boolean
  dealerPrices: Record<string, number>
}

const DealerContext = createContext<DealerState>({ isDealer: false, dealerPrices: {} })

// Bayi statüsü localStorage'daki kullanıcı nesnesine değil, sunucuya sorularak
// belirleniyor — admin statüyü verdiği/geri aldığı anda bir sonraki sayfa
// yüklemesinde geçerli olur, istemci tarafında taklit edilemez.
export function DealerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DealerState>({ isDealer: false, dealerPrices: {} })

  useEffect(() => {
    const token = localStorage.getItem('pn_session')
    if (!token) return
    fetch('/api/dealer/prices', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.prices) setState({ isDealer: true, dealerPrices: data.prices })
      })
      .catch(() => {})
  }, [])

  return <DealerContext.Provider value={state}>{children}</DealerContext.Provider>
}

export function useDealer() {
  return useContext(DealerContext)
}
