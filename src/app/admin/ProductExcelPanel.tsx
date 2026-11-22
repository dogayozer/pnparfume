'use client'

import { useState } from 'react'
import { COLLECTIONS } from '@/lib/collections'

type Issue = { sheet: string; row: number; sku?: string; message: string }
type Preview = {
  applied: boolean
  summary: { updated: number; unchanged: number; rejected: number }
  updates: { sku: string; changes: Record<string, [unknown, unknown]> }[]
  formulaUpdates: { sku: string; before: number; after: number }[]
  issues: Issue[]
}

const MAX_ROWS = 200
const show = (v: unknown) => (v === null || v === undefined || v === '' ? '—' : typeof v === 'boolean' ? (v ? 'EVET' : 'HAYIR') : String(v))

// Koleksiyon bazında Excel indir → düzenle → yükle → önizle → onayla.
export default function ProductExcelPanel({
  adminFetch,
  onApplied,
}: {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>
  onApplied: () => void
}) {
  const [collection, setCollection] = useState('all')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState<'download' | 'preview' | 'apply' | null>(null)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const download = async () => {
    setBusy('download'); setMsg(null)
    try {
      const res = await adminFetch(`/api/admin/products/export?collection=${encodeURIComponent(collection)}`)
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'İndirilemedi')
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `urunler-${collection}-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    } catch (e: any) {
      setMsg({ kind: 'err', text: e.message || 'İndirilemedi' })
    } finally { setBusy(null) }
  }

  const send = async (f: File, apply: boolean) => {
    const body = new FormData()
    body.append('file', f)
    body.append('apply', apply ? '1' : '0')
    const res = await adminFetch('/api/admin/products/excel', { method: 'POST', body })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || 'İşlem başarısız')
    return data as Preview
  }

  const pick = async (f: File | null) => {
    setFile(f); setPreview(null); setMsg(null)
    if (!f) return
    setBusy('preview')
    try { setPreview(await send(f, false)) }
    catch (e: any) { setMsg({ kind: 'err', text: e.message }) }
    finally { setBusy(null) }
  }

  const apply = async () => {
    if (!file) return
    setBusy('apply'); setMsg(null)
    try {
      const r = await send(file, true)
      setMsg({ kind: 'ok', text: `Uygulandı: ${r.summary.updated} ürün güncellendi, ${r.summary.rejected} satır atlandı.` })
      setPreview(null); setFile(null)
      onApplied()
    } catch (e: any) { setMsg({ kind: 'err', text: e.message }) }
    finally { setBusy(null) }
  }

  const rows = preview?.updates.flatMap((u) => Object.entries(u.changes).map(([f, [o, n]]) => ({ sku: u.sku, f, o, n }))) ?? []
  const warnings = preview?.issues.filter((i) => i.message.startsWith('Uyarı')) ?? []
  const errors = preview?.issues.filter((i) => !i.message.startsWith('Uyarı')) ?? []
  const nothing = preview && preview.summary.updated === 0

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 space-y-5">
      <div>
        <h3 className="font-semibold text-gray-900">Koleksiyon Bazında Excel ile Güncelle</h3>
        <p className="text-sm text-gray-500 mt-1">
          Önce mevcut ürünleri indirin, Excel&apos;de düzenleyip geri yükleyin. Yazmadan önce değişiklikler burada önizlenir.
          Boş bırakılan hücre alanı değiştirmez. Barkod sütununu metin olarak bırakın; yeni ürün bu yolla eklenmez.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">Koleksiyon</label>
          <select value={collection} onChange={(e) => setCollection(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm">
            <option value="all">Tümü</option>
            {COLLECTIONS.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <button type="button" onClick={download} disabled={busy !== null} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-5 py-3 rounded-xl text-xs shadow-sm">
          {busy === 'download' ? 'Hazırlanıyor...' : 'Excel indir'}
        </button>
        <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium px-5 py-3 rounded-xl text-xs">
          {busy === 'preview' ? 'Kontrol ediliyor...' : 'Düzenlenmiş Excel yükle'}
          <input type="file" accept=".xlsx" className="hidden" disabled={busy !== null}
            onChange={(e) => { const f = e.target.files?.[0] ?? null; e.target.value = ''; void pick(f) }} />
        </label>
      </div>

      {msg && <div className={`text-sm rounded-xl p-3 ${msg.kind === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{msg.text}</div>}

      {preview && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-indigo-50 rounded-xl p-3"><div className="text-xl font-bold text-indigo-700">{preview.summary.updated}</div>güncellenecek</div>
            <div className="bg-gray-50 rounded-xl p-3"><div className="text-xl font-bold text-gray-700">{preview.summary.unchanged}</div>değişmeyen</div>
            <div className="bg-red-50 rounded-xl p-3"><div className="text-xl font-bold text-red-700">{preview.summary.rejected}</div>hatalı (atlanacak)</div>
          </div>

          {rows.length > 0 && (
            <div className="overflow-x-auto border border-gray-200 rounded-xl max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0"><tr><th className="p-2 text-left">SKU</th><th className="p-2 text-left">Alan</th><th className="p-2 text-left">Eski</th><th className="p-2 text-left">Yeni</th></tr></thead>
                <tbody>
                  {rows.slice(0, MAX_ROWS).map((r, i) => (
                    <tr key={i} className="border-t border-gray-100"><td className="p-2 font-mono">{r.sku}</td><td className="p-2">{r.f}</td><td className="p-2 text-gray-500">{show(r.o)}</td><td className="p-2 font-semibold">{show(r.n)}</td></tr>
                  ))}
                </tbody>
              </table>
              {rows.length > MAX_ROWS && <div className="p-2 text-xs text-gray-500">…ve {rows.length - MAX_ROWS} değişiklik daha</div>}
            </div>
          )}

          {preview.formulaUpdates.length > 0 && (
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="font-semibold mb-1">Formülü değişecek ürünler ({preview.formulaUpdates.length}) — tüm formül satırları dosyadakilerle değiştirilir:</div>
              {preview.formulaUpdates.slice(0, 50).map((f) => <div key={f.sku}><span className="font-mono">{f.sku}</span>: {f.before} → {f.after} satır</div>)}
            </div>
          )}

          {errors.length > 0 && (
            <div className="text-xs bg-red-50 border border-red-200 rounded-xl p-3 max-h-48 overflow-y-auto">
              <div className="font-semibold mb-1">Hatalar (bu satırlar atlanır):</div>
              {errors.slice(0, MAX_ROWS).map((i, k) => <div key={k}>{i.sheet}{i.row ? ` satır ${i.row}` : ''}{i.sku ? ` · ${i.sku}` : ''}: {i.message}</div>)}
            </div>
          )}
          {warnings.length > 0 && (
            <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-3 max-h-32 overflow-y-auto">
              {warnings.slice(0, 50).map((i, k) => <div key={k}>{i.sku ? `${i.sku}: ` : ''}{i.message}</div>)}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="button" onClick={apply} disabled={busy !== null || !!nothing} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl text-xs shadow-sm">
              {busy === 'apply' ? 'Uygulanıyor...' : 'Onayla ve uygula'}
            </button>
            <button type="button" onClick={() => { setPreview(null); setFile(null) }} disabled={busy !== null} className="text-xs text-gray-600 underline">Vazgeç</button>
            {nothing && <span className="text-xs text-gray-500">Uygulanacak değişiklik yok.</span>}
          </div>
        </div>
      )}
    </div>
  )
}
