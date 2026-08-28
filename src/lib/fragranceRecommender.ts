// Blend Engine — "Notalarını Ayarla": bir baz üründen yola çıkıp kullanıcının
// istediği nota değişikliklerini KÜTÜPHANEDEKİ GERÇEK ÜRÜNLERDEN karşılayan
// öneri motoru. Hammadde bazında serbest formülasyon YOK — üretim sadece
// mevcut tarifleri karıştırabildiği için her öneri, kataloğun kendi
// içinden seçilen bir SKU'dur.
//
// fragranceCompatibility.ts'teki aynı aile-tekerleği mesafe fonksiyonunu
// (familyCompatibility) hem "azalt" önerisinde denge kontrolü için hem de
// "en yakın karakter" benzerlik hesabında kullanır.

import { familyCompatibility } from './fragranceCompatibility'

export type FamilyProfile = Record<string, number>

export interface CandidateProduct {
  sku: string
  profile: FamilyProfile
}

// Birden fazla ürünün (oran ağırlıklı) aile profillerini tek bir kombine
// profile birleştirir — Adım 4'teki blendPrice mantığıyla aynı ratio kullanımı.
export function blendProfiles(items: { profile: FamilyProfile, ratio: number }[]): FamilyProfile {
  const result: FamilyProfile = {}
  for (const item of items) {
    for (const [family, weight] of Object.entries(item.profile)) {
      result[family] = (result[family] || 0) + weight * (item.ratio / 100)
    }
  }
  return result
}

export function topFamilies(profile: FamilyProfile, n = 6): [string, number][] {
  return Object.entries(profile).sort((a, b) => b[1] - a[1]).slice(0, n)
}

// "Artır": hedef ailede kütüphanede en güçlü olan gerçek ürünü döner.
// "Azalt": hedef aile ağırlığı düşük olan, ama mevcut harmanla (baseProfile'ın
// en baskın ailesi üzerinden) makul uyumlu kalan bir ürün önerir — literal
// çıkarma değil, o notayı taşımayan bir esansla DENGELEME.
export function recommendEssenceForFamily(
  targetFamily: string,
  direction: 'boost' | 'reduce',
  candidates: CandidateProduct[],
  excludeSkus: string[],
  baseProfile: FamilyProfile
): CandidateProduct | null {
  const pool = candidates.filter(c => !excludeSkus.includes(c.sku))
  if (pool.length === 0) return null

  if (direction === 'boost') {
    return pool.reduce<CandidateProduct | null>((best, c) => {
      const val = c.profile[targetFamily] || 0
      const bestVal = best ? (best.profile[targetFamily] || 0) : -1
      return val > bestVal ? c : best
    }, null)
  }

  const baseTop = topFamilies(baseProfile, 1)[0]?.[0]
  let best: CandidateProduct | null = null
  let bestScore = -Infinity
  for (const c of pool) {
    const targetWeight = c.profile[targetFamily] || 0
    const candidateTop = topFamilies(c.profile, 1)[0]?.[0]
    const compat = baseTop && candidateTop ? familyCompatibility(baseTop, candidateTop) : 70
    // Düşük hedef ağırlık + yüksek genel uyum istiyoruz.
    const score = compat - targetWeight * 2
    if (score > bestScore) {
      bestScore = score
      best = c
    }
  }
  return best
}

// İki aile profili arası 0-100 benzerlik: ortak ağırlıklı aile çiftlerinin
// familyCompatibility'sinin ağırlıklı ortalaması (fragranceCompatibility.ts'teki
// katman-uyumluluk hesabıyla aynı yöntem, burada katman yerine tüm profil).
function profileSimilarity(a: FamilyProfile, b: FamilyProfile): number {
  let weightedSum = 0
  let weightTotal = 0
  for (const famA of Object.keys(a)) {
    for (const famB of Object.keys(b)) {
      const w = a[famA] * b[famB]
      if (w <= 0) continue
      weightedSum += familyCompatibility(famA, famB) * w
      weightTotal += w
    }
  }
  if (weightTotal === 0) return 0
  return weightedSum / weightTotal
}

// Yeni oluşan harmanın profiline kataloğun en çok benzeyen ürününü bulur —
// "yeni formülün karakteri" için (o ürünün mood_tag'i ödünç alınır).
export function nearestCatalogMatch(
  blendProfile: FamilyProfile,
  candidates: CandidateProduct[],
  excludeSkus: string[] = []
): { sku: string, similarity: number } | null {
  const pool = candidates.filter(c => !excludeSkus.includes(c.sku))
  if (pool.length === 0) return null

  let bestSku: string | null = null
  let bestSim = -Infinity
  for (const c of pool) {
    const sim = profileSimilarity(blendProfile, c.profile)
    if (sim > bestSim) {
      bestSim = sim
      bestSku = c.sku
    }
  }
  return bestSku ? { sku: bestSku, similarity: Math.round(bestSim) } : null
}
