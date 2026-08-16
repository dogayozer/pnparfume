import { Meilisearch } from 'meilisearch'

const meiliClient = new Meilisearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://127.0.0.1:7700',
  apiKey: process.env.MEILISEARCH_ADMIN_KEY || '',
})

export default meiliClient
