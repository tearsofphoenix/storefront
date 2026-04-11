"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  removeAuthToken,
} from "./cookies"

export type WishlistItem = {
  id: string
  product_variant_id: string
  product_variant?: {
    id: string
    title: string
    product: {
      id: string
      title: string
      handle: string
      thumbnail: string | null
    }
  }
}

export type Wishlist = {
  id: string
  customer_id: string
  sales_channel_id: string
  items: WishlistItem[]
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

const handleWishlistError = async (
  error: unknown
): Promise<null> => {
  if (isUnauthorizedError(error)) {
    await removeAuthToken()
    return null
  }

  medusaError(error)
}

// Retrieve the authenticated customer's wishlist
export const retrieveWishlist =
  async (): Promise<Wishlist | null> => {
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("wishlists")),
    }

    return await sdk.client
      .fetch<{ wishlist: Wishlist }>(`/store/customers/me/wishlists`, {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ wishlist }) => wishlist)
      .catch(handleWishlistError)
  }

// Create a wishlist for the authenticated customer
export const createWishlist =
  async (): Promise<Wishlist | null> => {
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) return null

    const headers = {
      ...authHeaders,
    }

    const wishlist = await sdk.client
      .fetch<{ wishlist: Wishlist }>(`/store/customers/me/wishlists`, {
        method: "POST",
        headers,
      })
      .then(({ wishlist }) => wishlist)
      .catch(handleWishlistError)

    if (!wishlist) {
      return null
    }

    const cacheTag = await getCacheTag("wishlists")
    revalidateTag(cacheTag)

    return wishlist
  }

// Add a variant to the wishlist (creates wishlist if needed)
export const addVariantToWishlist = async (
  variantId: string
): Promise<Wishlist | null> => {
  const authHeaders = await getAuthHeaders()

  if (!("authorization" in authHeaders)) return null

  const headers = {
    ...authHeaders,
  }

  // Ensure wishlist exists
  let wishlist = await retrieveWishlist()

  if (!wishlist) {
    wishlist = await createWishlist()
    if (!wishlist) return null
  }

  const result = await sdk.client
    .fetch<{ wishlist: Wishlist }>(`/store/customers/me/wishlists/items`, {
      method: "POST",
      headers,
      body: { variant_id: variantId },
    })
    .then(({ wishlist }) => wishlist)
    .catch(handleWishlistError)

  if (!result) {
    return null
  }

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return result
}

// Remove an item from the wishlist
export const removeWishlistItem = async (
  wishlistItemId: string
): Promise<Wishlist | null> => {
  const authHeaders = await getAuthHeaders()

  if (!("authorization" in authHeaders)) return null

  const headers = {
    ...authHeaders,
  }

  const result = await sdk.client
    .fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlists/items/${wishlistItemId}`,
      {
        method: "DELETE",
        headers,
      }
    )
    .then(({ wishlist }) => wishlist)
    .catch(handleWishlistError)

  if (!result) {
    return null
  }

  const cacheTag = await getCacheTag("wishlists")
  revalidateTag(cacheTag)

  return result
}

// Generate a share token for the wishlist
export const shareWishlist =
  async (): Promise<string | null> => {
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) return null

    const headers = {
      ...authHeaders,
    }

    return await sdk.client
      .fetch<{ token: string }>(`/store/customers/me/wishlists/share`, {
        method: "POST",
        headers,
      })
      .then(({ token }) => token)
      .catch(() => null)
  }

// Retrieve a shared wishlist by token (public, no auth needed)
export const retrieveSharedWishlist = async (
  token: string
): Promise<Wishlist | null> => {
  return await sdk.client
    .fetch<{ wishlist: Wishlist }>(`/store/wishlists/${token}`, {
      method: "GET",
    })
    .then(({ wishlist }) => wishlist)
    .catch(() => null)
}
