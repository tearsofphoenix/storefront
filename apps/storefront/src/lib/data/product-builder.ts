"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"

import { getOrSetCart } from "./cart"
import { getCacheOptions, getCacheTag, getCartId, getAuthHeaders } from "./cookies"
import { listProducts } from "./products"
import type { BuilderConfig, ProductBuilder } from "@types/product-builder"

const hydrateBuilderProducts = async (
  builder: ProductBuilder,
  regionId: string
): Promise<ProductBuilder> => {
  const relatedProductIds = Array.from(
    new Set([
      ...builder.complementary_products.map((item) => item.product_id),
      ...builder.addons.map((item) => item.product_id),
    ])
  )

  if (!relatedProductIds.length) {
    return builder
  }

  const {
    response: { products },
  } = await listProducts({
    queryParams: {
      id: relatedProductIds,
      limit: relatedProductIds.length,
    },
    regionId,
  })

  const productsById = new Map(products.map((product) => [product.id, product]))

  return {
    ...builder,
    complementary_products: builder.complementary_products.map((item) => ({
      ...item,
      product: productsById.get(item.product_id),
    })),
    addons: builder.addons.map((item) => ({
      ...item,
      product: productsById.get(item.product_id),
    })),
  }
}

export async function retrieveProductBuilder(
  productId: string,
  regionId: string
): Promise<ProductBuilder | null> {
  const next = {
    ...(await getCacheOptions("products")),
  }

  try {
    const { product_builder } = await sdk.client.fetch<{
      product_builder: ProductBuilder
    }>(`/store/products/${productId}/builder`, {
      method: "GET",
      next,
      cache: "force-cache",
    })

    return await hydrateBuilderProducts(product_builder, regionId)
  } catch {
    return null
  }
}

export async function addBuilderProductToCart({
  countryCode,
  productId,
  variantId,
  quantity = 1,
  builderConfig,
}: {
  countryCode: string
  productId: string
  variantId: string
  quantity?: number
  builderConfig: BuilderConfig
}) {
  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const { cart: updatedCart } = await sdk.client.fetch<{ cart: any }>(
    `/store/carts/${cart.id}/product-builder`,
    {
      method: "POST",
      body: {
        product_id: productId,
        variant_id: variantId,
        quantity,
        ...builderConfig,
      },
      headers,
    }
  )

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag)

  return updatedCart
}

export async function removeBuilderLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing line item ID when deleting builder item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting builder item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const { cart } = await sdk.client.fetch<{ cart: any }>(
    `/store/carts/${cartId}/product-builder/${lineId}`,
    {
      method: "DELETE",
      headers,
    }
  )

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag)

  return cart
}
