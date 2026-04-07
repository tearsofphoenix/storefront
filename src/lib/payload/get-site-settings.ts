import "server-only"

import { payloadFetch } from "@lib/payload/client"
import { PayloadSiteSettings } from "types/payload"

export const getSiteSettings = async () => {
  return payloadFetch<PayloadSiteSettings>("/api/globals/site-settings", {
    query: {
      depth: 1,
    },
    tags: ["payload:globals:site-settings"],
  })
}
