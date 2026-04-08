"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { logMedusaRequestError } from "@lib/util/log-medusa-request-error"

const DEFAULT_HOMEPAGE_COLLECTION_HANDLE = "homepage-featured"

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
        cache: "force-cache",
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        next,
        cache: "force-cache",
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
    .catch((error) => {
      logMedusaRequestError("listCollections", error)
      return { collections: [], count: 0 }
    })
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next,
      cache: "force-cache",
    })
    .then(({ collections }) => collections[0] ?? null)
    .catch((error) => {
      logMedusaRequestError("getCollectionByHandle", error)
      return null
    })
}

const getHomepageCollectionHandleCandidates = () => {
  const configuredHandle = process.env.HOMEPAGE_COLLECTION_HANDLE?.trim()

  return Array.from(
    new Set(
      [configuredHandle, DEFAULT_HOMEPAGE_COLLECTION_HANDLE].filter(
        (handle): handle is string => Boolean(handle)
      )
    )
  )
}

export const getHomepageCollection = async () => {
  for (const handle of getHomepageCollectionHandleCandidates()) {
    const collection = await getCollectionByHandle(handle)

    if (collection) {
      return collection
    }
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  return collections[0] ?? null
}
