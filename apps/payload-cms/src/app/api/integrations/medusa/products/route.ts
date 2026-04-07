import configPromise from '@payload-config'
import { getPayload } from 'payload'

type SyncAction = 'upsert' | 'delete'

type ProductSyncInput = {
  id: string
  handle: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  status?: string | null
  collectionTitle?: string | null
  tags?: string[]
}

type SyncRequestBody = {
  action: SyncAction
  product: ProductSyncInput
}

const normalizeValue = (value?: string | null) => value?.trim() || null

const validateSecret = (request: Request) => {
  const expected = process.env.PAYLOAD_SYNC_SECRET

  if (!expected) {
    return false
  }

  return request.headers.get('x-payload-sync-secret') === expected
}

const buildProductPageData = (
  product: ProductSyncInput,
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
    collectionTitle: normalizeValue(product.collectionTitle),
    tags: product.tags ?? [],
  },
})

export const POST = async (request: Request) => {
  if (!validateSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as SyncRequestBody | null

  if (!body?.action || !body?.product?.id || !body.product.handle || !body.product.title) {
    return Response.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const payload = await getPayload({
    config: configPromise,
  })

  const existing = await payload.find({
    collection: 'product-pages',
    where: {
      medusaProductId: {
        equals: body.product.id,
      },
    },
    depth: 0,
    limit: 1,
  })

  const existingDoc = existing.docs[0]

  if (body.action === 'delete') {
    if (!existingDoc) {
      return Response.json({ ok: true, action: 'delete', found: false })
    }

    const updated = await payload.update({
      collection: 'product-pages',
      id: existingDoc.id,
      data: buildProductPageData(body.product, 'deleted'),
    })

    return Response.json({ ok: true, action: 'delete', id: updated.id })
  }

  if (existingDoc) {
    const updated = await payload.update({
      collection: 'product-pages',
      id: existingDoc.id,
      data: buildProductPageData(body.product, 'active'),
    })

    return Response.json({ ok: true, action: 'upsert', id: updated.id })
  }

  const created = await payload.create({
    collection: 'product-pages',
    data: {
      ...buildProductPageData(body.product, 'active'),
      status: 'draft',
      sections: [],
    },
  })

  return Response.json({ ok: true, action: 'upsert', id: created.id }, { status: 201 })
}
