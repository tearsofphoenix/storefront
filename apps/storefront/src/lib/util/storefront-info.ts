import "server-only"

import { getSiteSettings } from "@lib/payload/get-site-settings"
import { getSeoToolkitSiteName } from "@lib/util/plugin-manifest"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"

function readString(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null
}

export async function resolveStorefrontName() {
  const siteSettings = await getSiteSettings()
  const payloadSiteName = readString(siteSettings?.siteName)

  if (payloadSiteName) {
    return payloadSiteName
  }

  const pluginSiteName = readString(getSeoToolkitSiteName())

  if (pluginSiteName) {
    return pluginSiteName
  }

  return readString(getStorefrontThemePresentation().brandName)
}
