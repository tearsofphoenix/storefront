"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const listRegions = async () => {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      cache: "no-store",
    })
    .then(({ regions }) => regions)
    .catch(() => null)
}

export const retrieveRegion = async (id: string) => {
  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      cache: "no-store",
    })
    .then(({ region }) => region)
    .catch(() => null)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

const normalizeCountryCode = (countryCode?: string | null) =>
  (countryCode ?? "").trim().toLowerCase()

const rebuildRegionMap = (regions: HttpTypes.StoreRegion[]) => {
  regionMap.clear()

  regions.forEach((region) => {
    region.countries?.forEach((country) => {
      const code = normalizeCountryCode(country?.iso_2)

      if (code) {
        regionMap.set(code, region)
      }
    })
  })
}

export const getRegion = async (countryCode: string) => {
  try {
    const regions = await listRegions()

    if (!regions) {
      return null
    }

    rebuildRegionMap(regions)

    const normalizedCountryCode = normalizeCountryCode(countryCode) || "us"
    const region = regionMap.get(normalizedCountryCode) ?? null

    if (!region) {
      console.warn(
        `[regions] 未找到国家代码 "${normalizedCountryCode}" 对应的 Region，请检查 Medusa Admin 中该 Region 的 Countries 配置。`
      )
    }

    return region
  } catch {
    return null
  }
}
