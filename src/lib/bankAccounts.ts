import { prisma } from '@/lib/prisma'

// Havale/EFT hesapları admin panelinden (Banka Hesapları sekmesi) tanımlanır.
// Türkiye havale siparişlerinde TRY hesapları, yurt dışı siparişlerde USD/EUR hesapları gösterilir.
export const BANK_CURRENCIES = ['TRY', 'USD', 'EUR'] as const
export type BankCurrency = (typeof BANK_CURRENCIES)[number]

export type PublicBankAccount = {
  currency: string
  bankName: string
  accountHolder: string
  iban: string
  swift: string | null
  branch: string | null
  note: string | null
}

export async function getTransferAccounts(kind: 'tr' | 'intl'): Promise<PublicBankAccount[]> {
  const currencies = kind === 'tr' ? ['TRY'] : ['USD', 'EUR']
  return prisma.bankAccount.findMany({
    where: { isActive: true, currency: { in: currencies } },
    orderBy: [{ currency: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { currency: true, bankName: true, accountHolder: true, iban: true, swift: true, branch: true, note: true },
  })
}

type Locale = 'tr' | 'en' | 'ar'

const LABELS: Record<Locale, { title: string; bank: string; holder: string; iban: string; swift: string; branch: string; ref: string; none: string }> = {
  tr: {
    title: 'Havale / EFT bilgileri',
    bank: 'Banka',
    holder: 'Hesap sahibi',
    iban: 'IBAN',
    swift: 'SWIFT/BIC',
    branch: 'Şube',
    ref: 'Havale açıklamasına sipariş numaranızı yazmayı unutmayın:',
    none: 'Banka hesap bilgileri en kısa sürede size iletilecektir.',
  },
  en: {
    title: 'Bank transfer details',
    bank: 'Bank',
    holder: 'Account holder',
    iban: 'IBAN',
    swift: 'SWIFT/BIC',
    branch: 'Branch',
    ref: 'Please include your order number in the transfer description:',
    none: 'Our bank account details will be sent to you shortly.',
  },
  ar: {
    title: 'بيانات التحويل البنكي',
    bank: 'البنك',
    holder: 'اسم صاحب الحساب',
    iban: 'رقم الآيبان (IBAN)',
    swift: 'SWIFT/BIC',
    branch: 'الفرع',
    ref: 'يرجى كتابة رقم طلبك في وصف التحويل:',
    none: 'سنرسل لك بيانات الحساب البنكي في أقرب وقت.',
  },
}

const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// E-posta gövdesine konacak banka hesabı bloğu (müşteri diline göre).
export function bankAccountsHtml(accounts: PublicBankAccount[], orderNumber: string, locale: Locale): string {
  const L = LABELS[locale] || LABELS.en
  const dir = locale === 'ar' ? ' dir="rtl"' : ''
  if (!accounts.length) return `<p${dir}>${esc(L.none)}</p>`
  const blocks = accounts
    .map(
      (a) => `
      <div style="border:1px solid #ddd;border-radius:8px;padding:10px 12px;margin:8px 0">
        <div><strong>${esc(a.currency)}</strong> — ${esc(L.bank)}: ${esc(a.bankName)}</div>
        <div>${esc(L.holder)}: ${esc(a.accountHolder)}</div>
        <div>${esc(L.iban)}: <strong>${esc(a.iban)}</strong></div>
        ${a.swift ? `<div>${esc(L.swift)}: ${esc(a.swift)}</div>` : ''}
        ${a.branch ? `<div>${esc(L.branch)}: ${esc(a.branch)}</div>` : ''}
        ${a.note ? `<div style="color:#555">${esc(a.note)}</div>` : ''}
      </div>`
    )
    .join('')
  return `<div${dir}><p><strong>${esc(L.title)}</strong></p>${blocks}<p>${esc(L.ref)} <strong>${esc(orderNumber)}</strong></p></div>`
}
