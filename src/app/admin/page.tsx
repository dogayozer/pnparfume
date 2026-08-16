'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, RefreshCw, Box, Users, TrendingUp } from 'lucide-react'

type ScenarioRule = {
  id: string
  rule_key: string
  rule_value: number
  description: string
  is_active: boolean
}

export default function AdminDashboard() {
  const [rules, setRules] = useState<ScenarioRule[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchRules = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/scenarios')
      const data = await res.json()
      if (res.ok) setRules(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleUpdate = async (rule_key: string, newValue: number) => {
    setSavingId(rule_key)
    setMessage(null)
    
    try {
      const res = await fetch('/api/admin/scenarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule_key, rule_value: newValue })
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Kural başarıyla güncellendi.' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Güncelleme başarısız')
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Kaydedilirken bir hata oluştu.' })
    } finally {
      setSavingId(null)
    }
  }

  const handleValueChange = (id: string, newVal: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, rule_value: parseFloat(newVal) || 0 } : r))
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-md flex items-center justify-center font-bold">PN</div>
            <span className="font-medium tracking-wide">Yönetim Paneli</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span>Hoş geldiniz, Yönetici</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium transition-colors">
              <Settings size={18} />
              Senaryolar (Kurallar)
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              <Box size={18} />
              Sipariş Yönetimi
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              <Users size={18} />
              Müşteriler & Elçiler
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
              <TrendingUp size={18} />
              Raporlar
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Senaryo Kuralları</h1>
              <p className="text-gray-500">Kampanya tutarlarını, indirimleri ve kargo kurallarını buradan yönetin.</p>
            </div>
            <button 
              onClick={fetchRules}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Yenile
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <AlertCircle size={20} />
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {loading && rules.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <RefreshCw size={32} className="mx-auto mb-4 animate-spin text-gray-300" />
              <p>Kurallar Yükleniyor...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                    <th className="px-6 py-4 font-medium">Kural Anahtarı</th>
                    <th className="px-6 py-4 font-medium">Açıklama</th>
                    <th className="px-6 py-4 font-medium w-48">Değer (TL / %)</th>
                    <th className="px-6 py-4 font-medium w-32 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-md font-mono text-sm tracking-tight border border-gray-200">
                          {rule.rule_key}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-600 text-sm">
                        {rule.description}
                      </td>
                      <td className="px-6 py-5">
                        <div className="relative">
                          <input 
                            type="number"
                            value={rule.rule_value}
                            onChange={(e) => handleValueChange(rule.id, e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleUpdate(rule.rule_key, rule.rule_value)}
                          disabled={savingId === rule.rule_key}
                          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {savingId === rule.rule_key ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                          Kaydet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
