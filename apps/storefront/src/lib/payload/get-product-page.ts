import "server-only"

import { payloadFetch } from "@lib/payload/client"
import { PayloadFindResponse, PayloadProductPage } from "types/payload"

export const getProductPageByHandle = async (handle: string) => {
  const response = await payloadFetch<PayloadFindResponse<PayloadProductPage>>(
    "/api/product-pages",
    {
      query: {
        depth: 2,
        limit: 1,
        where: {
          handle: {
            equals: handle,
          },
          status: {
            equals: "published",
          },
          syncStatus: {
            equals: "active",
          },
        },
      },
      tags: [`payload:product-page:${handle}`],
    }
  )

  return response?.docs?.[0] ?? null
}
