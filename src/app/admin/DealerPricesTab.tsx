'use client'

import { useEffect, useState } from 'react'
import { Search, Save, RotateCcw } from 'lucide-react'
import { computeDealerPrice } from '@/lib/dealerPrice'

type AdminFetch = (url: string, options?: RequestInit) => Promise<Response>

interface Props {
  products: any[]
  adminFetch: AdminFetch
  showMsg: (type: 'success' | 'error', text: string) => void
  onDealerPriceSaved: (sku: string, dealerPrice: number | null) => void
}

// Sitenin gerçekte kullandığı satış fiyatı (bkz. urun/[sku]/page.tsx): trendyol ilanı, yoksa maliyet.
const retailOf = (p: any): number =>
  p.marketplaceListings?.find((l: any) => l.platform === 'trendyol')?.price || p.base_cost || 0

export default function DealerPricesTab({ products, adminFetch, showMsg, onDealerPriceSaved }: Props) {
  const [percent, setPercent] = useState<number>(30)
  const [percentDraft, setPercentDraft] = useState('30')
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    adminFetch('/api/admin/scenarios')
      .then(res => (res.ok ? res.json() : []))
      .then((rules: any[]) => {
        const rule = Array.isArray(rules) ? rules.find(r => r.rule_key === 'DEALER_DISCOUNT_PERCENT') : null
        if (rule) {
          setPercent(rule.rule_value)
          setPercentDraft(String(rule.rule_value))
        }
      })
      .catch(() => {})
  }, [adminFetch])

  const savePercent = async () => {
    const value = parseFloat(percentDraft)
    if (isNaN(value) || value < 0 || value >= 100) {
      showMsg('error', 'İskonto 0 ile 99 arasında olmalı.')
      return
    }
    setSaving('percent')
    try {
      const res = await adminFetch('/api/admin/scenarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule_key: 'DEALER_DISCOUNT_PERCENT', rule_value: value })
      })
      if (!res.ok) throw new Error()
      setPercent(value)
      showMsg('success', `Varsayılan bayi iskontosu %${value} olarak kaydedildi.`)
    } catch {
      showMsg('error', 'İskonto kaydedilemedi.')
    } finally {
      setSaving(null)
    }
  }

  const saveDealerPrice = async (sku: string, value: number | null) => {
    setSaving(sku)
    try {
      const res = await adminFetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, dealer_price: value })
      })
      if (!res.ok) throw new Error()
      onDealerPriceSaved(sku, value)
      setDrafts(prev => {
        const next = { ...prev }
        delete next[sku]
        return next
      })
      showMsg('success', value ? `PN ${sku} bayi fiyatı ${value} TL olarak kaydedildi.` : `PN ${sku} varsayılan bayi fiyatına döndü.`)
    } catch {
      showMsg('error', 'Bayi fiyatı kaydedilemedi.')
    } finally {
      setSaving(null)
    }
  }

  const q = search.toLowerCase()
  const rows = products.filter((p: any) =>
    p.publish_status !== 'DRAFT' &&
    (!q || p.sku.toLowerCase().includes(q) || (p.seo_name || p.original_name || '').toLowerCase().includes(q))
  )

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-xl">
          <h3 className="font-semibold text-gray-900 mb-1">Bayi Fiyatları</h3>
          <p className="text-sm text-gray-500">
            Ürüne özel fiyat girilmezse bayi fiyatı, sitedeki güncel satış fiyatından varsayılan iskonto düşülerek hesaplanır. Bayi fiyatı hiçbir zaman ürün maliyetinin altına inmez. Fiyatları sadece <strong>Müşteriler</strong> sekmesinde bayi tiki verilmiş üyeler görür.
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Varsayılan Bayi İskontosu (%)</label>
            <input
              type="number"
              min={0}
              max={99}
              value={percentDraft}
              onChange={e => setPercentDraft(e.target.value)}
              className="w-28 bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm font-bold text-gray-900"
            />
          </div>
          <button
            onClick={savePercent}
            disabled={saving === 'percent' || parseFloat(percentDraft) === percent}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-40"
          >
            Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="SKU veya ürün adıyla ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Ürün</th>
                <th className="px-3 py-2 text-right">Satış Fiyatı</th>
                <th className="px-3 py-2 text-right">Maliyet</th>
                <th className="px-3 py-2 text-right">Bayi Fiyatı</th>
                <th className="px-3 py-2">Özel Bayi Fiyatı</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p: any) => {
                const retail = retailOf(p)
                const defaultPrice = computeDealerPrice(retail, null, p.base_cost || 0, percent)
                const effective = computeDealerPrice(retail, p.dealer_price, p.base_cost || 0, percent)
                const draft = drafts[p.sku]
                const draftNum = draft !== undefined ? parseFloat(draft) : NaN
                const margin = retail > 0 ? Math.round((1 - effective / retail) * 100) : 0
                return (
                  <tr key={p.sku} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-3 py-2 font-mono font-bold text-gray-800">{p.sku}</td>
                    <td className="px-3 py-2 text-gray-600 truncate max-w-[220px]">{p.seo_name || p.original_name}</td>
                    <td className="px-3 py-2 text-right text-gray-700">{retail} TL</td>
                    <td className="px-3 py-2 text-right text-gray-400">{p.base_cost} TL</td>
                    <td className="px-3 py-2 text-right">
                      <span className="font-bold text-indigo-700">{effective} TL</span>
                      <span className="block text-[10px] text-gray-400">
                        {p.dealer_price ? 'özel fiyat' : 'varsayılan'} · bayi marjı %{margin}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          placeholder={String(defaultPrice)}
                          value={draft ?? (p.dealer_price ? String(p.dealer_price) : '')}
                          onChange={e => setDrafts(prev => ({ ...prev, [p.sku]: e.target.value }))}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs"
                        />
                        <button
                          onClick={() => saveDealerPrice(p.sku, draftNum > 0 ? draftNum : null)}
                          disabled={saving === p.sku || draft === undefined}
                          title="Kaydet"
                          className="p-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-30"
                        >
                          <Save size={14} />
                        </button>
                        {p.dealer_price && (
                          <button
                            onClick={() => saveDealerPrice(p.sku, null)}
                            disabled={saving === p.sku}
                            title="Varsayılana döndür"
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </div>
                      {draftNum > 0 && draftNum < (p.base_cost || 0) && (
                        <span className="block text-[10px] text-rose-600 mt-1">Maliyetin altında — {Math.ceil(p.base_cost)} TL uygulanır</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
