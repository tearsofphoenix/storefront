"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { type LoyaltyActivity, buildLoyaltyActivities } from "@lib/util/loyalty"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  removeAuthToken,
} from "./cookies"
import { listOrders } from "./orders"

type LoyaltyPointsResponse = {
  points: number
}

const isUnauthorizedError = (error: unknown) => {
  const status = (error as any)?.response?.status ?? (error as any)?.status

  if (status === 401) {
    return true
  }

  const message =
    typeof (error as any)?.message === "string"
      ? (error as any).message
      : String(error ?? "")

  return message.toLowerCase().includes("unauthorized")
}

export const listLoyaltyActivities = async (
  limit: number = 20
): Promise<LoyaltyActivity[]> => {
  try {
    const orders = await listOrders(limit, 0)

    return buildLoyaltyActivities(orders ?? [])
  } catch {
    return []
  }
}

export const retrieveLoyaltyPoints = async (): Promise<number | null> => {
  const authHeaders = await getAuthHeaders()

  if (!("authorization" in authHeaders)) {
    return null
  }

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("loyalty-points")),
  }

  try {
    const { points } = await sdk.client.fetch<LoyaltyPointsResponse>(
      "/store/customers/me/loyalty-points",
      {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      }
    )

    return typeof points === "number" ? points : 0
  } catch (error) {
    if (isUnauthorizedError(error)) {
      await removeAuthToken()
    }

    return null
  }
}

export const applyLoyaltyPoints = async (cartId: string) => {
  if (!cartId) {
    throw new Error("Cart ID is required")
  }

  const authHeaders = await getAuthHeaders()

  if (!("authorization" in authHeaders)) {
    throw new Error("Please sign in to use loyalty points")
  }

  const headers = {
    ...authHeaders,
  }

  const result = await sdk.client
    .fetch(`/store/carts/${cartId}/loyalty-points`, {
      method: "POST",
      headers,
    })
    .catch(medusaError)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const loyaltyCacheTag = await getCacheTag("loyalty-points")
  revalidateTag(loyaltyCacheTag)

  return result
}

export const removeLoyaltyPoints = async (cartId: string) => {
  if (!cartId) {
    throw new Error("Cart ID is required")
  }

  const authHeaders = await getAuthHeaders()

  if (!("authorization" in authHeaders)) {
    throw new Error("Please sign in to use loyalty points")
  }

  const headers = {
    ...authHeaders,
  }

  const result = await sdk.client
    .fetch(`/store/carts/${cartId}/loyalty-points`, {
      method: "DELETE",
      headers,
    })
    .catch(medusaError)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const loyaltyCacheTag = await getCacheTag("loyalty-points")
  revalidateTag(loyaltyCacheTag)

  return result
}
