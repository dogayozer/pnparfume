// Veritabanına bağımlı olmayan saf hesap — hem sunucu (bayi fiyat ucu) hem
// admin paneli (önizleme) aynı formülü kullansın diye ayrı dosyada.
// Elle girilmiş bayi fiyatı varsa o, yoksa güncel satış fiyatından iskonto;
// sonuç hiçbir zaman ürün maliyetinin (base_cost) altına inmez.
export function computeDealerPrice(retailPrice: number, override: number | null | undefined, baseCost: number, discountPercent: number): number {
  const raw = override && override > 0 ? override : Math.round(retailPrice * (1 - discountPercent / 100))
  return Math.max(raw, Math.ceil(baseCost))
}
