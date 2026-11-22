'use client'

import { useEffect, useState } from 'react'
import { Landmark, Plus, Save, Trash2, Edit3, X, Info } from 'lucide-react'

type AdminFetch = (url: string, options?: RequestInit) => Promise<Response>

interface Props {
  adminFetch: AdminFetch
  showMsg: (type: 'success' | 'error', text: string) => void
}

type BankAccount = {
  id: string
  currency: 'TRY' | 'USD' | 'EUR'
  bankName: string
  accountHolder: string
  iban: string
  swift: string | null
  branch: string | null
  note: string | null
  isActive: boolean
  sortOrder: number
}

const CURRENCIES: { key: 'TRY' | 'USD' | 'EUR'; label: string; where: string }[] = [
  { key: 'TRY', label: 'Türk Lirası (TRY)', where: 'Türkiye havale siparişlerinde gösterilir' },
  { key: 'USD', label: 'Amerikan Doları (USD)', where: 'Yurt dışı siparişlerde gösterilir' },
  { key: 'EUR', label: 'Euro (EUR)', where: 'Yurt dışı siparişlerde gösterilir' },
]

const emptyForm = {
  id: '',
  currency: 'TRY' as 'TRY' | 'USD' | 'EUR',
  bankName: '',
  accountHolder: '',
  iban: '',
  swift: '',
  branch: '',
  note: '',
  isActive: true,
  sortOrder: 0,
}

const groupIban = (v: string) => v.replace(/(.{4})/g, '$1 ').trim()

export default function BankAccountsTab({ adminFetch, showMsg }: Props) {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof emptyForm | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminFetch('/api/admin/bank-accounts')
      if (res.ok) setAccounts(await res.json())
      else showMsg('error', 'Banka hesapları getirilemedi')
    } catch {
      showMsg('error', 'Banka hesapları getirilemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await adminFetch('/api/admin/bank-accounts', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        showMsg('success', form.id ? 'Banka hesabı güncellendi.' : 'Banka hesabı eklendi.')
        setForm(null)
        await load()
      } else {
        showMsg('error', data.error || 'Kaydedilemedi')
      }
    } catch {
      showMsg('error', 'Kaydedilemedi')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (a: BankAccount) => {
    const res = await adminFetch('/api/admin/bank-accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...a, isActive: !a.isActive }),
    })
    if (res.ok) await load()
    else showMsg('error', 'Durum değiştirilemedi')
  }

  const remove = async (a: BankAccount) => {
    if (!confirm(`${a.bankName} (${a.currency}) hesabını silmek istediğinize emin misiniz? Geçmiş siparişler etkilenmez.`)) return
    const res = await adminFetch(`/api/admin/bank-accounts?id=${encodeURIComponent(a.id)}`, { method: 'DELETE' })
    if (res.ok) {
      showMsg('success', 'Banka hesabı silindi.')
      await load()
    } else showMsg('error', 'Silinemedi')
  }

  const input = 'w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none'

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 text-sm text-indigo-900">
        <Info size={18} className="flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>Burada tanımladığınız hesaplar, müşteri sepette <strong>Banka Havalesi</strong> seçtiğinde ekranda ve e-postada gösterilir.</p>
          <p><strong>TRY</strong> hesapları Türkiye adresli havale siparişlerinde, <strong>USD ve EUR</strong> hesapları yurt dışı adresli siparişlerde kullanılır. Hesabı pasife alırsanız müşteriye gösterilmez.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setForm({ ...emptyForm })}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus size={16} /> Banka Hesabı Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Yükleniyor...</div>
      ) : (
        CURRENCIES.map(cur => {
          const list = accounts.filter(a => a.currency === cur.key)
          return (
            <div key={cur.key} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <Landmark size={16} className="text-indigo-600" /> {cur.label}
                </div>
                <span className="text-xs text-gray-500">{cur.where}</span>
              </div>
              {list.length === 0 ? (
                <div className="px-5 py-6 text-sm text-gray-400">Bu döviz cinsinde hesap tanımlı değil.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {list.map(a => (
                    <li key={a.id} className={`px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 ${a.isActive ? '' : 'opacity-50'}`}>
                      <div className="flex-1 min-w-0 text-sm">
                        <div className="font-semibold text-gray-900">{a.bankName} <span className="font-normal text-gray-500">— {a.accountHolder}</span></div>
                        <div className="font-mono text-[13px] text-gray-700 break-all">{groupIban(a.iban)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {[a.swift && `SWIFT: ${a.swift}`, a.branch && `Şube: ${a.branch}`, a.note].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(a)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${a.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                        >
                          {a.isActive ? 'Aktif' : 'Pasif'}
                        </button>
                        <button
                          onClick={() => setForm({ ...emptyForm, ...a, swift: a.swift || '', branch: a.branch || '', note: a.note || '' })}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Düzenle"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => remove(a)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })
      )}

      {form && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={save} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{form.id ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı'}</h3>
              <button type="button" onClick={() => setForm(null)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">Döviz cinsi</span>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value as any })} className={`${input} mt-1`}>
                    {CURRENCIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">Sıra (küçük olan önce)</span>
                  <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} className={`${input} mt-1`} />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Banka adı *</span>
                <input required value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} className={`${input} mt-1`} placeholder="Örn. Garanti BBVA" />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Hesap sahibi *</span>
                <input required value={form.accountHolder} onChange={e => setForm({ ...form, accountHolder: e.target.value })} className={`${input} mt-1`} placeholder="Örn. PN Parfüm Ltd. Şti." />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">IBAN / Hesap numarası *</span>
                <input required value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} className={`${input} mt-1 font-mono`} placeholder="TR00 0000 0000 0000 0000 0000 00" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">SWIFT/BIC (yurt dışı için)</span>
                  <input value={form.swift} onChange={e => setForm({ ...form, swift: e.target.value })} className={`${input} mt-1 font-mono`} />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-gray-700">Şube</span>
                  <input value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} className={`${input} mt-1`} />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Müşteriye gösterilecek not (isteğe bağlı)</span>
                <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} maxLength={300} className={`${input} mt-1`} placeholder="Örn. Havale açıklamasına sipariş numarasını yazın" />
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                Aktif (müşteriye gösterilsin)
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100">Vazgeç</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold">
                <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
