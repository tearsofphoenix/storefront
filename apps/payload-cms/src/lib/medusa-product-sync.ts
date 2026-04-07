import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

type MedusaStoreProduct = {
  id: string
  handle: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  status?: string | null
  collection?: {
    title?: string | null
  } | null
  tags?: Array<{
    value?: string | null
  }> | null
}

type MedusaProductListResponse = {
  products: MedusaStoreProduct[]
  count?: number
  limit?: number
  offset?: number
}

type SyncSummary = {
  created: number
  updated: number
  deleted: number
  fetched: number
}

const normalizeValue = (value?: string | null) => value?.trim() || null

const getMedusaSyncConfig = () => {
  const baseUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    ''
  const publishableKey =
    process.env.MEDUSA_STOREFRONT_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
    ''

  if (!baseUrl) {
    throw new Error('Missing MEDUSA_BACKEND_URL for Payload product sync')
  }

  if (!publishableKey) {
    throw new Error(
      'Missing MEDUSA_STOREFRONT_PUBLISHABLE_KEY or NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY for Payload product sync',
    )
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    publishableKey,
  }
}

const buildProductPageData = (
  product: MedusaStoreProduct,
  syncStatus: 'active' | 'deleted',
) => ({
  title: product.title,
  slug: product.handle,
  handle: product.handle,
  medusaProductId: product.id,
  syncStatus,
  medusaSummary: {
    productTitle: product.title,
    subtitle: normalizeValue(product.subtitle),
    thumbnail: normalizeValue(product.thumbnail),
    productStatus: normalizeValue(product.status),
    collectionTitle: normalizeValue(product.collection?.title),
    tags:
      product.tags
        ?.map((tag) => normalizeValue(tag.value))
        .filter((tag): tag is string => Boolean(tag)) ?? [],
  },
})

const fetchMedusaProductsPage = async (
  offset: number,
  limit: number,
): Promise<MedusaProductListResponse> => {
  const { baseUrl, publishableKey } = getMedusaSyncConfig()
  const searchParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    fields: '*collection,*tags',
  })

  const response = await fetch(`${baseUrl}/store/products?${searchParams.toString()}`, {
    cache: 'no-store',
    headers: {
      'x-publishable-api-key': publishableKey,
    },
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(
      `Failed to fetch Medusa products for Payload sync: ${response.status} ${response.statusText} ${errorText}`.trim(),
    )
  }

  return (await response.json()) as MedusaProductListResponse
}

const upsertProductPage = async (payload: Payload, product: MedusaStoreProduct) => {
  const existing = await payload.find({
    collection: 'product-pages',
    where: {
      medusaProductId: {
        equals: product.id,
      },
    },
    depth: 0,
    limit: 1,
  })

  const existingDoc = existing.docs[0]

  if (existingDoc) {
    await payload.update({
      collection: 'product-pages',
      id: existingDoc.id,
      data: buildProductPageData(product, 'active'),
    })

    return 'updated' as const
  }

  await payload.create({
    collection: 'product-pages',
    data: {
      ...buildProductPageData(product, 'active'),
      status: 'published',
      sections: [],
    },
  })

  return 'created' as const
}

const markMissingProductPagesAsDeleted = async (
  payload: Payload,
  syncedProductIds: Set<string>,
) => {
  const existing = await payload.find({
    collection: 'product-pages',
    depth: 0,
    limit: 5000,
    pagination: false,
  })

  let deleted = 0

  for (const doc of existing.docs) {
    if (!doc.medusaProductId || syncedProductIds.has(doc.medusaProductId)) {
      continue
    }

    if (doc.syncStatus === 'deleted') {
      continue
    }

    await payload.update({
      collection: 'product-pages',
      id: doc.id,
      data: {
        syncStatus: 'deleted',
      },
    })

    deleted += 1
  }

  return deleted
}

export const syncMedusaProductsIntoPayload = async (
  limit = 100,
): Promise<SyncSummary> => {
  const payload = await getPayload({
    config: configPromise,
  })

  const normalizedLimit = Math.min(Math.max(limit, 1), 250)
  const summary: SyncSummary = {
    created: 0,
    updated: 0,
    deleted: 0,
    fetched: 0,
  }
  const syncedProductIds = new Set<string>()

  let offset = 0

  while (true) {
    const response = await fetchMedusaProductsPage(offset, normalizedLimit)
    const products = response.products ?? []

    if (!products.length) {
      break
    }

    for (const product of products) {
      const action = await upsertProductPage(payload, product)
      syncedProductIds.add(product.id)
      summary[action] += 1
      summary.fetched += 1
    }

    if (products.length < normalizedLimit) {
      break
    }

    offset += normalizedLimit
  }

  summary.deleted = await markMissingProductPagesAsDeleted(
    payload,
    syncedProductIds,
  )

  return summary
}

export const validatePayloadSyncSecret = (request: Request) => {
  const expected = process.env.PAYLOAD_SYNC_SECRET

  if (!expected) {
    return false
  }

  return request.headers.get('x-payload-sync-secret') === expected
}
