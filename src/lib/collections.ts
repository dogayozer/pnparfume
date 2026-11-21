// Koleksiyon kayıtları. Yeni koleksiyon eklemek için listeye bir satır eklemek yeterli:
// ürünler SKU ön ekiyle (skuPrefix) bir koleksiyona bağlanır, veritabanı değişikliği gerekmez.
// Ön eksiz (klasik) ürünler "Ana Katalog"a aittir ve burada listelenmez.

export interface Collection {
  slug: string
  name: string
  tagline: string
  description: string
  // Ön ekli koleksiyonlar SKU ön ekiyle bağlanır; ön eksiz (varsayılan) koleksiyon, diğer
  // koleksiyonlara ait olmayan tüm ürünleri kapsar (PN).
  skuPrefix?: string
  image?: string
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'pn',
    name: 'PN',
    tagline: 'PN Parfüm ana koleksiyonu',
    description: 'PN Parfüm ana koleksiyonu; erkek, kadın ve unisex kokuları PN koduyla sunar. Filtrelerle sana en uygun kokuyu bul.',
  },
  {
    slug: 'pien-creative',
    name: 'Pien Creative',
    tagline: 'Yeni nesil karakter kokular',
    description:
      'Pien Creative koleksiyonu; kutusu, şişesi ve notalarıyla ayrı bir çizgide tasarlanan 25 özel kokudan oluşur. Her biri PN koduyla sunulur.',
    skuPrefix: 'CS-',
  },
  {
    slug: 'pien',
    name: 'Pien',
    tagline: 'PN kokularının Pien imzalı serisi',
    description:
      'Pien serisi; aynı koku karakterini ve nota yapısını Pien şişesi, kutusu ve görselleriyle sunan 275 kokudan oluşur. Her biri Pien koduyla sunulur.',
    skuPrefix: 'Pien ',
  },
]

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}

export function getCollectionBySku(sku: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.skuPrefix && sku.startsWith(c.skuPrefix))
}

// Klasik ürünler ve her koleksiyonu dönüşümlü dizer (vitrin/katalogda karışık görünüm için).
export function mixByCollection<T extends { sku: string }>(items: T[]): T[] {
  const groups: T[][] = [items.filter((p) => !getCollectionBySku(p.sku))]
  for (const c of COLLECTIONS) {
    if (c.skuPrefix) groups.push(items.filter((p) => getCollectionBySku(p.sku)?.slug === c.slug))
  }
  const mixed: T[] = []
  const longest = Math.max(...groups.map((g) => g.length))
  for (let i = 0; i < longest; i++) {
    for (const g of groups) if (g[i]) mixed.push(g[i])
  }
  return mixed
}

// Koleksiyonun ürün kapsamı (Prisma where parçası)
export function collectionScope(c: Collection): Record<string, unknown> {
  if (c.skuPrefix) return { sku: { startsWith: c.skuPrefix } }
  const others = COLLECTIONS.filter((o) => o.skuPrefix).map((o) => ({ sku: { startsWith: o.skuPrefix } }))
  return { NOT: others }
}
