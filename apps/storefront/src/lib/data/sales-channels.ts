"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { logMedusaRequestError } from "@lib/util/log-medusa-request-error"

type StoreSalesChannel = {
  id: string
  name?: string | null
}

type ResolveSalesChannelIdInput = {
  region?: HttpTypes.StoreRegion | null
  countryCode?: string | null
}

const DEFAULT_SALES_CHANNEL_NAME = "default sales channel"

let availableSalesChannelsPromise: Promise<StoreSalesChannel[]> | null = null

const normalizeValue = (value?: string | null) =>
  value?.trim().toLowerCase() ?? ""

const matchesContext = (salesChannelName: string, candidates: string[]) => {
  return candidates.some((candidate) => {
    if (!candidate) {
      return false
    }

    return (
      salesChannelName === candidate ||
      salesChannelName.includes(candidate) ||
      candidate.includes(salesChannelName)
    )
  })
}

const readConfiguredSalesChannelId = () => {
  const configuredSalesChannelId =
    process.env.MEDUSA_STOREFRONT_SALES_CHANNEL_ID?.trim()

  return configuredSalesChannelId || null
}

const listAvailableSalesChannels = async (): Promise<StoreSalesChannel[]> => {
  if (!availableSalesChannelsPromise) {
    availableSalesChannelsPromise = sdk.client
      .fetch<{
        products: Array<{ sales_channels?: StoreSalesChannel[] | null }>
      }>("/store/products", {
        method: "GET",
        query: {
          limit: 50,
          fields: "id,*sales_channels",
        },
        cache: "force-cache",
      })
      .then(({ products }) => {
        const dedupedSalesChannels = new Map<string, StoreSalesChannel>()

        products.forEach((product) => {
          product.sales_channels?.forEach((salesChannel) => {
            if (salesChannel?.id) {
              dedupedSalesChannels.set(salesChannel.id, salesChannel)
            }
          })
        })

        return Array.from(dedupedSalesChannels.values())
      })
      .catch((error) => {
        availableSalesChannelsPromise = null
        console.warn(
          "[sales-channels] 自动探测 storefront sales channel 失败，将回退为默认请求上下文。",
          error
        )
        return []
      })
  }

  return availableSalesChannelsPromise
}

const pickBestSalesChannelId = ({
  salesChannels,
  region,
  countryCode,
}: {
  salesChannels: StoreSalesChannel[]
  region?: HttpTypes.StoreRegion | null
  countryCode?: string | null
}) => {
  if (!salesChannels.length) {
    return null
  }

  if (salesChannels.length === 1) {
    return salesChannels[0].id
  }

  const contextCandidates = [
    normalizeValue(region?.name),
    normalizeValue(countryCode),
    ...(region?.countries ?? []).flatMap((country) => {
      return [
        normalizeValue(country?.display_name),
        normalizeValue(country?.name),
        normalizeValue(country?.iso_2),
      ]
    }),
  ].filter(Boolean)

  const sortedSalesChannels = [...salesChannels].sort((left, right) => {
    return normalizeValue(left.name).localeCompare(normalizeValue(right.name))
  })

  const matchedSalesChannel = sortedSalesChannels.find((salesChannel) => {
    const salesChannelName = normalizeValue(salesChannel.name)
    return matchesContext(salesChannelName, contextCandidates)
  })

  if (matchedSalesChannel) {
    return matchedSalesChannel.id
  }

  const defaultSalesChannel = sortedSalesChannels.find((salesChannel) => {
    return normalizeValue(salesChannel.name) === DEFAULT_SALES_CHANNEL_NAME
  })

  return defaultSalesChannel?.id ?? sortedSalesChannels[0].id
}

export const resolveSalesChannelId = async ({
  region,
  countryCode,
}: ResolveSalesChannelIdInput = {}) => {
  const configuredSalesChannelId = readConfiguredSalesChannelId()

  if (configuredSalesChannelId) {
    const salesChannels = await listAvailableSalesChannels()

    if (!salesChannels.length) {
      return configuredSalesChannelId
    }

    const configuredChannelExists = salesChannels.some(
      (salesChannel) => salesChannel.id === configuredSalesChannelId
    )

    if (configuredChannelExists) {
      return configuredSalesChannelId
    }

    console.warn(
      `[sales-channels] 配置的 MEDUSA_STOREFRONT_SALES_CHANNEL_ID="${configuredSalesChannelId}" 不在当前 publishable key 可见的 sales channels 中，将自动回退。`
    )

    return pickBestSalesChannelId({
      salesChannels,
      region,
      countryCode,
    })
  }

  const salesChannels = await listAvailableSalesChannels()

  return pickBestSalesChannelId({
    salesChannels,
    region,
    countryCode,
  })
}
