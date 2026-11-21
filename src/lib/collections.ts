// Koleksiyon kayıtları. Yeni koleksiyon eklemek için listeye bir satır eklemek yeterli:
// ürünler SKU ön ekiyle (skuPrefix) bir koleksiyona bağlanır, veritabanı değişikliği gerekmez.
// Ön eksiz (klasik) ürünler "Ana Katalog"a aittir ve burada listelenmez.

export interface Collection {
  slug: string
  name: string
  tagline: string
  description: string
  skuPrefix: string
  image?: string
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'pien-creative',
    name: 'Pien Creative',
    tagline: 'Yeni nesil karakter kokular',
    description:
      'Pien Creative koleksiyonu; kutusu, şişesi ve notalarıyla ayrı bir çizgide tasarlanan 25 özel kokudan oluşur. Her biri PN koduyla sunulur.',
    skuPrefix: 'CS-',
  },
]

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}

export function getCollectionBySku(sku: string): Collection | undefined {
  return COLLECTIONS.find((c) => sku.startsWith(c.skuPrefix))
}
