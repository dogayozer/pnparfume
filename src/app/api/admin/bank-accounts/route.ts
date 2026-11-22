import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { BANK_CURRENCIES } from '@/lib/bankAccounts'

const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

// IBAN/hesap no: boşluk ve tireleri sadeleştirip büyük harfe çevirir (gösterimde 4'lü gruplanır).
const normalizeIban = (v: unknown) => clean(v, 60).replace(/[\s-]+/g, '').toUpperCase()

function parseBody(body: any): { error: string } | { data: Record<string, any> } {
  const currency = clean(body.currency, 3).toUpperCase()
  if (!(BANK_CURRENCIES as readonly string[]).includes(currency)) return { error: 'Döviz cinsi TRY, USD veya EUR olmalı' }
  const bankName = clean(body.bankName, 120)
  const accountHolder = clean(body.accountHolder, 150)
  const iban = normalizeIban(body.iban)
  if (!bankName) return { error: 'Banka adı gerekli' }
  if (!accountHolder) return { error: 'Hesap sahibi gerekli' }
  if (!/^[A-Z0-9]{8,40}$/.test(iban)) return { error: 'IBAN / hesap numarası geçersiz (8-40 harf veya rakam)' }
  return {
    data: {
      currency,
      bankName,
      accountHolder,
      iban,
      swift: clean(body.swift, 20).toUpperCase() || null,
      branch: clean(body.branch, 120) || null,
      note: clean(body.note, 300) || null,
      isActive: body.isActive !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Math.trunc(Number(body.sortOrder)) : 0,
    },
  }
}

export async function GET(req: Request) {
  const admin = requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  const accounts = await prisma.bankAccount.findMany({
    orderBy: [{ currency: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(accounts, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const parsed = parseBody(await req.json())
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const account = await prisma.bankAccount.create({ data: parsed.data as any })
    return NextResponse.json(account)
  } catch (err) {
    console.error('Banka hesabı eklenemedi:', err)
    return NextResponse.json({ error: 'Banka hesabı eklenemedi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const body = await req.json()
    const id = clean(body.id, 60)
    if (!id) return NextResponse.json({ error: 'Hesap ID gerekli' }, { status: 400 })
    const parsed = parseBody(body)
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const account = await prisma.bankAccount.update({ where: { id }, data: parsed.data as any })
    return NextResponse.json(account)
  } catch (err) {
    console.error('Banka hesabı güncellenemedi:', err)
    return NextResponse.json({ error: 'Banka hesabı güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    const id = new URL(req.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Hesap ID gerekli' }, { status: 400 })
    await prisma.bankAccount.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Banka hesabı silinemedi:', err)
    return NextResponse.json({ error: 'Banka hesabı silinemedi' }, { status: 500 })
  }
}
