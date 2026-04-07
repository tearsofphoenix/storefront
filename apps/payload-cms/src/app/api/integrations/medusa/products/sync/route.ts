import { syncMedusaProductsIntoPayload, validatePayloadSyncSecret } from '@/lib/medusa-product-sync'

type SyncRequestBody = {
  limit?: number
}

export const POST = async (request: Request) => {
  if (!validatePayloadSyncSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as SyncRequestBody | null
  const summary = await syncMedusaProductsIntoPayload(body?.limit)

  return Response.json({
    ok: true,
    ...summary,
  })
}
