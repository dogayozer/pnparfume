'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, RefreshCw, Box, Users, TrendingUp, Sparkles } from 'lucide-react'

type ScenarioRule = {
  id: string
  rule_key: string
  rule_value: number
  description: string
  is_active: boolean
}

type AiConfig = {
  id: string
  system_prompt: string
  active_campaign: string | null
  can_give_discount: boolean
  discount_limit: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'ai'>('scenarios')
  const [rules, setRules] = useState<ScenarioRule[]>([])
  const [aiConfig, setAiConfig] = useState<AiConfig | null>(null)
  
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

  const fetchAiConfig = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ai')
      const data = await res.json()
      if (res.ok) setAiConfig(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'scenarios') {
      fetchRules()
    } else if (activeTab === 'ai') {
      fetchAiConfig()
    }
  }, [activeTab])

  const handleUpdateRule = async (rule_key: string, newValue: number) => {
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

  const handleUpdateAiConfig = async () => {
    if (!aiConfig) return
    setSavingId('ai_config')
    setMessage(null)
    
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiConfig)
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Yapay zeka ayarları başarıyla kaydedildi.' })
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
            <button 
              onClick={() => setActiveTab('scenarios')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'scenarios' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings size={18} />
              Senaryolar (Kurallar)
            </button>
            <button 
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'ai' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Sparkles size={18} />
              Yapay Zeka (Aura)
            </button>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
              <Box size={18} />
              Sipariş Yönetimi
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
              <Users size={18} />
              Müşteriler & Elçiler
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors opacity-50 cursor-not-allowed">
              <TrendingUp size={18} />
              Raporlar
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-semibold mb-2">
                {activeTab === 'scenarios' ? 'Senaryo Kuralları' : 'Asistan Eğitmeni (Aura)'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'scenarios' 
                  ? 'Kampanya tutarlarını, indirimleri ve kargo kurallarını buradan yönetin.'
                  : 'Yapay zeka asistanının kişiliğini, sınırlarını ve müşterilere söylemesini istediğiniz kampanyaları yönetin.'
                }
              </p>
            </div>
            <button 
              onClick={activeTab === 'scenarios' ? fetchRules : fetchAiConfig}
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

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <RefreshCw size={32} className="mx-auto mb-4 animate-spin text-gray-300" />
              <p>Yükleniyor...</p>
            </div>
          ) : activeTab === 'scenarios' ? (
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
                            onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, rule_value: parseFloat(e.target.value) || 0 } : r))}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleUpdateRule(rule.rule_key, rule.rule_value)}
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
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              {aiConfig && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Sistem Komutu (Kişilik ve Kurallar)</label>
                    <p className="text-xs text-gray-500 mb-3">Asistanın nasıl davranacağını, nelere dikkat edeceğini ve hangi kelimeleri kullanacağını belirler. Bu alandaki kurallar kesindir.</p>
                    <textarea 
                      rows={12}
                      value={aiConfig.system_prompt}
                      onChange={(e) => setAiConfig({...aiConfig, system_prompt: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Aktif Kampanya ve Duyurular</label>
                    <p className="text-xs text-gray-500 mb-3">Eğer asistanın müşterilere belirli bir kampanyadan (örn: Sevgililer Günü %20 İndirim) bahsetmesini istiyorsanız buraya yazın.</p>
                    <textarea 
                      rows={3}
                      placeholder="Şu an aktif bir kampanya yok..."
                      value={aiConfig.active_campaign || ''}
                      onChange={(e) => setAiConfig({...aiConfig, active_campaign: e.target.value})}
                      className="w-full bg-white border border-gray-300 rounded-lg p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div>
                        <h4 className="font-medium text-gray-900">İndirim Verme Yetkisi</h4>
                        <p className="text-xs text-gray-500 mt-1">Asistan otonom olarak kupon üretebilir mi?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={aiConfig.can_give_discount} onChange={(e) => setAiConfig({...aiConfig, can_give_discount: e.target.checked})} />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium text-gray-900">Maksimum İndirim Limiti (%)</h4>
                        <p className="text-xs text-gray-500 mt-1">Verebileceği en yüksek indirim oranı.</p>
                      </div>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={aiConfig.discount_limit}
                        onChange={(e) => setAiConfig({...aiConfig, discount_limit: parseFloat(e.target.value) || 0})}
                        className="w-24 bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button 
                      onClick={handleUpdateAiConfig}
                      disabled={savingId === 'ai_config'}
                      className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {savingId === 'ai_config' ? (
                        <RefreshCw size={20} className="animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      Yapay Zeka Ayarlarını Kaydet
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
