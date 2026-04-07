import "server-only"

import { payloadFetch } from "@lib/payload/client"
import { PayloadFindResponse, PayloadLandingPage } from "types/payload"

export const getLandingPageBySlug = async (slug: string) => {
  const response = await payloadFetch<PayloadFindResponse<PayloadLandingPage>>(
    "/api/landing-pages",
    {
      query: {
        depth: 2,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
          status: {
            equals: "published",
          },
        },
      },
      tags: [`payload:landing-page:${slug}`],
    }
  )

  return response?.docs?.[0] ?? null
}
