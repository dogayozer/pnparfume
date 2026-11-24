// HepsiJET Kargo Entegrasyonu (Retail/STD Gönderi Oluşturma). Fodos'taki (fodos.com.tr) entegrasyonun pnparfume uyarlaması.
// Doküman: https://documenter.getpostman.com/view/33109546/2sA2rGwKq9
//
// GÜVENLİK: Kullanıcı adı ve parola YALNIZCA ortam değişkenlerinden okunur (HEPSIJET_USERNAME, HEPSIJET_PASSWORD).
// Depo herkese açık olduğu için bunlar koda ASLA yazılmaz. Tanımlı değilse işlemler açık bir hata verir.
// Varsayılan adres ortamı TEST'tir; canlıya geçişte HEPSIJET_BASE_URL (https://integration.hepsijet.com) ve
// HEPSIJET_SENDER_ADDRESS_ID (canlı gönderici adres kodu) HepsiJET'in verdiği değerlerle ayarlanmalıdır.

const BASE_URL = process.env.HEPSIJET_BASE_URL || 'https://integration-apitest.hepsijet.com'
export const HEPSIJET_IS_TEST = BASE_URL.includes('apitest')

const COMPANY_NAME = process.env.HEPSIJET_COMPANY_NAME || 'PİEN PARFUM'
const COMPANY_CODE = process.env.HEPSIJET_COMPANY_CODE || 'PİENPARF'
const XDOCK_CODE = process.env.HEPSIJET_XDOCK_CODE || 'PIENPARFSILIVRI'
const SENDER_ADDRESS_ID = process.env.HEPSIJET_SENDER_ADDRESS_ID || 'pien-pienparf-428' // TEST kodu; canlı kod HepsiJET'ten alınır
const SENDER_CITY = process.env.HEPSIJET_SENDER_CITY || 'İstanbul'
const SENDER_TOWN = process.env.HEPSIJET_SENDER_TOWN || 'SİLİVRİ'
const SENDER_DISTRICT = process.env.HEPSIJET_SENDER_DISTRICT || 'MİMAR SİNAN'
const SENDER_ADDRESS_LINE1 = process.env.HEPSIJET_SENDER_ADDRESS_LINE1 || 'MİMAR SİNAN SİLİVRİ MAH. AKARSU SOKAK NO:4/A SİLİVRİ/İSTANBUL'

const HEADERS = { 'Content-Type': 'application/json', 'X-Origin': 'integration', 'X-Client-Id': 'hj-integration', Accept: 'application/json' }

// Token ömrü 60 dk (HepsiJET dokümanı): sıcak bir lambda içinde tekrar token almamak için basit önbellek.
let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < tokenExpiresAt) return cachedToken

  const username = process.env.HEPSIJET_USERNAME
  const password = process.env.HEPSIJET_PASSWORD
  if (!username || !password) throw new Error('HepsiJET kimlik bilgileri tanımlı değil (HEPSIJET_USERNAME / HEPSIJET_PASSWORD).')

  const res = await fetch(`${BASE_URL}/auth/token`, { method: 'POST', headers: HEADERS, body: JSON.stringify({ username, password }) })
  const json: any = await res.json()
  if (!res.ok || !json?.data?.token) throw new Error('HepsiJET token alınamadı: ' + (json?.message || `HTTP ${res.status}`))
  cachedToken = json.data.token as string
  tokenExpiresAt = now + 55 * 60 * 1000 // 5 dk güvenlik payı
  return cachedToken
}

const authHeaders = async () => ({ ...HEADERS, 'X-Auth-Token': await getToken() })

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || '').trim().split(/\s+/)
  return { firstName: parts.slice(0, -1).join(' ') || parts[0] || '', lastName: parts.length > 1 ? parts[parts.length - 1] : '' }
}

export interface HepsijetOrderInput {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  shippingCity: string
  shippingDistrict: string
  shippingAddress: string
}

export interface HepsijetResult {
  success: boolean
  trackingNumber?: string
  trackingUrl?: string
  error?: string
}

export function buildDeliveryBody(order: HepsijetOrderInput, deliveryDate: string) {
  const { firstName, lastName } = splitName(order.customerName)
  return {
    company: { name: COMPANY_NAME, abbreviationCode: COMPANY_CODE },
    delivery: {
      customerDeliveryNo: order.orderNumber,
      customerOrderId: order.orderNumber,
      totalParcels: '1',
      desi: '1',
      deliverySlotOriginal: '0',
      deliveryDateOriginal: deliveryDate,
      deliveryType: 'RETAIL',
      product: { productCode: 'HX_STD' },
      senderAddress: {
        companyAddressId: SENDER_ADDRESS_ID,
        country: { name: 'Türkiye' },
        city: { name: SENDER_CITY },
        town: { name: SENDER_TOWN },
        district: { name: SENDER_DISTRICT },
        addressLine1: SENDER_ADDRESS_LINE1,
      },
      receiver: {
        companyCustomerId: crypto.randomUUID(),
        firstName,
        lastName,
        phone1: order.customerPhone || '',
        phone2: '',
        email: order.customerEmail || '',
      },
      recipientAddress: {
        companyAddressId: crypto.randomUUID(),
        country: { name: 'Türkiye' },
        city: { name: order.shippingCity || '' },
        town: { name: order.shippingDistrict || '' },
        district: { name: '' },
        addressLine1: order.shippingAddress || '',
      },
      recipientPerson: order.customerName,
      recipientPersonPhone1: order.customerPhone || '',
    },
    currentXDock: { abbreviationCode: XDOCK_CODE },
  }
}

/** Siparişi HepsiJET'e STD (Standart Teslimat) gönderisi olarak iletir; hata durumunda throw etmez, success:false döner. */
export async function sendHepsijetOrder(order: HepsijetOrderInput): Promise<HepsijetResult> {
  try {
    const body = buildDeliveryBody(order, new Date().toISOString().slice(0, 10))
    const res = await fetch(`${BASE_URL}/delivery/sendDeliveryOrderEnhanced`, { method: 'POST', headers: await authHeaders(), body: JSON.stringify(body) })
    const json: any = await res.json()
    if (!res.ok || json?.status !== 'OK') return { success: false, error: json?.message || `HTTP ${res.status}` }
    const barcodeInfo = json?.data?.zplBarcodeDTOList?.[0]
    return { success: true, trackingNumber: json?.data?.customerDeliveryNo || barcodeInfo?.barcodeNo, trackingUrl: barcodeInfo?.trackingUrl }
  } catch (e: any) {
    return { success: false, error: e.message || 'Bilinmeyen hata' }
  }
}

export type HepsijetTracking = { deliveryStatus: string | null; lastTransaction: string | null; moved: boolean }

// Kurye paketi okutmadan önce yanıt yalnızca {status:'OK'} olur (moved=false); alınınca `transactions` dolar,
// teslimde deliveryStatus='DELIVERED'. Bilinmeyen barkod HTTP 400 döner → null.
export async function getHepsijetTracking(barcode: string): Promise<HepsijetTracking | null> {
  const res = await fetch(`${BASE_URL}/deliveryTransaction/getDeliveryTracking`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ deliveries: [{ customerDeliveryNo: barcode }] }),
  })
  const json: any = await res.json()
  if (!res.ok || json?.status !== 'OK') return null
  const d = json?.data?.[0]
  if (!d) return { deliveryStatus: null, lastTransaction: null, moved: false }
  return { deliveryStatus: d.deliveryStatus ?? null, lastTransaction: d.lastTransaction ?? null, moved: Array.isArray(d.transactions) && d.transactions.length > 0 }
}

// Gönderiyi siler (kargo henüz teslim alınmamışken). Silinen barkod aynı numarayla yeniden gönderilebilir.
export async function cancelHepsijetOrder(barcode: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/delivery/deleteDeliveryOrder/${encodeURIComponent(barcode)}`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ deleteReason: 'IPTAL' }),
    })
    const json: any = await res.json()
    if (!res.ok || json?.status !== 'OK') return { success: false, error: json?.message || `HTTP ${res.status}` }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message || 'Bilinmeyen hata' }
  }
}

// HepsiJET'in zorunlu "ortak barkod" etiketi (10x15 cm), PDF. Barkod = customerDeliveryNo.
export async function getHepsijetLabelPdf(barcode: string): Promise<Buffer> {
  const res = await fetch(`${BASE_URL}/delivery/barcodes-label?format=PDF`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ barcodes: [barcode] }),
  })
  const json: any = await res.json()
  const dataUrl: string | undefined = json?.data?.labels?.[0]
  if (!res.ok || json?.status !== 'OK' || !dataUrl) throw new Error(json?.message || `HTTP ${res.status}`)
  return Buffer.from(dataUrl.split(',')[1], 'base64')
}
