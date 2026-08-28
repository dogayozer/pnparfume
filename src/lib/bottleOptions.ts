// Gerçek şişe/kutu seçenekleri — kaynak: referans Excel'in "sise" sayfası
// (240826_guncellenmis-gruplamaile_9.xlsx). Fiyatlar kutu dahildir ve
// özelleştirme panelinde/Blend Engine'de esans fiyatının ÜSTÜNE eklenir
// (hangi şişe seçilirse seçilsin, tam fiyatı eklenir — sabit dahil şişe yok).

export interface BottleOption {
  code: string
  label: string
  volumeMl: number
  price: number
  imageUrl: string
}

export const BOTTLE_OPTIONS: BottleOption[] = [
  { code: 'pn50', label: 'PN Klasik Şişe', volumeMl: 50, price: 250, imageUrl: 'http://parfumtasarla.com/resimler/sise/50mlsise.jpeg' },
  { code: 'asik100', label: 'Aşık Model Şişe', volumeMl: 100, price: 400, imageUrl: 'http://parfumtasarla.com/resimler/sise/100mlasik.jpg' },
  { code: 'pien100', label: 'Pien Model Şişe', volumeMl: 100, price: 400, imageUrl: 'http://parfumtasarla.com/resimler/sise/100mlpien.jpg' },
]

export const DEFAULT_BOTTLE_CODE = BOTTLE_OPTIONS[0].code

// ProductGallery.tsx'teki aynı desen: parfumtasarla.com görselleri mixed-content/
// güvenlik nedeniyle media-proxy üzerinden servis ediliyor.
export function toSecureImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://parfumtasarla.com') || url.startsWith('http://kasaptanetyiyelim.com')) {
    return `/api/media-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}
