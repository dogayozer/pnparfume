// Blend Engine — üst/kalp/dip katmanına göre yüzdesel koku ailesi uyumluluğu.
//
// Kaynak/mantık:
// - Fragrance Wheel (Michael Edwards): kokular dairesel bir tekerlek üzerinde
//   4 ana grupta (Floral, Oriental/Amber, Woody, Fresh) sıralanır; komşu
//   aileler harmonik, karşıt aileler "cesur/kontrastlı" kombinasyon oluşturur
//   (kötü değil, deneysel). https://skylar.com/blogs/notes/how-to-read-a-fragrance-wheel
// - Nota piramidi zamanlaması: üst notalar ~5-30 dk, kalp notaları ~15-30 dk'da
//   başlayıp 2-4 saat sürer ve "genel koku mimarisinin ~%65-70'i" sayılır, dip
//   notalar en son gelip 4-12+ saat kalır.
//   https://www.craftovator.co.uk/blogs/academy/top-middle-bottom-notes-understanding-the-fragrance-pyramid-and-scent-notes
//   https://smytten.com/blogs/fragrance/fragrance-notes-faq-top-middle-and-base-notes-explained

export type Layer = 'Üst' | 'Kalp' | 'Dip'

// Ingredient.family değerleri (canlı DB'den doğrulandı), Fragrance Wheel
// sırasına (Floral -> Oriental -> Woody -> Fresh -> Floral) yerleştirildi.
export const FAMILY_ANGLES: Record<string, number> = {
  'Çiçeksi': 0,
  'Meyveli': 25,
  'Sebze/Kuruyemiş': 50,
  'Gurme/Tatlı': 75,
  'Reçineli/Amber': 100,
  'Baharatlı': 125,
  'Deri/Hayvansi': 150,
  'Miskli': 180,
  'Odunsu': 205,
  'Odunsu-Sentetik': 230,
  'Çay/Konsantre': 255,
  'Yeşil/Aromatik': 280,
  'Sucul/Ozonik': 305,
  'Turunçgil': 330,
}

// Gerçek bir koku ailesi değil (alkol/taşıyıcı) — her aileyle tam uyumlu sayılır.
const NEUTRAL_FAMILY = 'Taşıyıcı/Baz'

// İki aile arası uyumluluk yüzdesi (0-100). Aynı aile=100, komşu aileler
// yüksek, karşıt aileler ~30'a iner (asla daha aşağı değil — "imkansız
// kombinasyon" yok, en uzak ikili bile "cesur" olarak skorlanır).
export function familyCompatibility(familyA: string, familyB: string): number {
  if (familyA === familyB) return 100
  if (familyA === NEUTRAL_FAMILY || familyB === NEUTRAL_FAMILY) return 100

  const a = FAMILY_ANGLES[familyA]
  const b = FAMILY_ANGLES[familyB]
  if (a === undefined || b === undefined) return 70 // tanınmayan aile — nötr bir varsayım

  const rawDiff = Math.abs(a - b) % 360
  const angularDistance = Math.min(rawDiff, 360 - rawDiff) // 0-180
  return Math.round(100 - (angularDistance / 180) * 70)
}

export interface WeightedIngredient {
  layer: Layer
  family: string
  absolute_weight_pct: number
}

export interface BlendItem {
  sku: string
  ratio: number // 0-100, bu esansın harmandaki oranı
  ingredients: WeightedIngredient[]
}

export interface CompatibilityResult {
  top: number
  heart: number
  base: number
  overall: number
}

// Genel skordaki katman ağırlıkları — kalp notaları koku mimarisinin en büyük
// parçası olduğu için en ağırlıklı, dip notalar süre olarak uzun sürdüğü için
// ikinci, üst notalar en kısa ömürlü olduğu için en az ağırlıklı.
const OVERALL_WEIGHTS = { top: 0.2, heart: 0.5, base: 0.3 }

function layerScore(items: BlendItem[], layer: Layer): number | null {
  // Sadece FARKLI esanslara ait hammadde çiftlerini karşılaştırıyoruz — bir
  // ürünün kendi içindeki notalar zaten dengeli formüle edilmiş, bizi
  // ilgilendiren iki farklı esansın bu katmanda çarpışıp çarpışmadığı.
  let weightedSum = 0
  let weightTotal = 0
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i].ingredients.filter(ing => ing.layer === layer)
      const b = items[j].ingredients.filter(ing => ing.layer === layer)
      for (const ingA of a) {
        for (const ingB of b) {
          const wA = (items[i].ratio / 100) * ingA.absolute_weight_pct
          const wB = (items[j].ratio / 100) * ingB.absolute_weight_pct
          const pairWeight = wA * wB
          if (pairWeight <= 0) continue
          weightedSum += familyCompatibility(ingA.family, ingB.family) * pairWeight
          weightTotal += pairWeight
        }
      }
    }
  }

  if (weightTotal === 0) return null // bu katmanda karşılaştırılacak çift yok
  return Math.round(weightedSum / weightTotal)
}

export function computeBlendCompatibility(items: BlendItem[]): CompatibilityResult | null {
  if (items.length < 2) return null

  const top = layerScore(items, 'Üst')
  const heart = layerScore(items, 'Kalp')
  const base = layerScore(items, 'Dip')

  const layers = [
    { score: top, weight: OVERALL_WEIGHTS.top },
    { score: heart, weight: OVERALL_WEIGHTS.heart },
    { score: base, weight: OVERALL_WEIGHTS.base },
  ].filter(l => l.score !== null) as { score: number, weight: number }[]

  if (layers.length === 0) return null

  const weightSum = layers.reduce((s, l) => s + l.weight, 0)
  const overall = Math.round(layers.reduce((s, l) => s + l.score * l.weight, 0) / weightSum)

  return { top: top ?? overall, heart: heart ?? overall, base: base ?? overall, overall }
}

export function compatibilityLabel(score: number): { label: string, tone: 'good' | 'balanced' | 'bold' } {
  if (score >= 85) return { label: 'Uyumlu', tone: 'good' }
  if (score >= 60) return { label: 'Dengeli', tone: 'balanced' }
  return { label: 'Cesur Kombinasyon', tone: 'bold' }
}
