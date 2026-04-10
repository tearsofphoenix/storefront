import { sdk } from "@lib/config"
import type { ProductBuilder, BuilderConfig } from "@types/product-builder"

export async function retrieveProductBuilder(
  productId: string
): Promise<ProductBuilder | null> {
  try {
    const { product_builder } = await sdk.client.fetch<{
      product_builder: ProductBuilder
    }>(`/admin/products/${productId}/builder`)
    return product_builder
  } catch {
    return null
  }
}

export async function addBuilderProductToCart(
  cartId: string,
  config: {
    product_id: string
    variant_id: string
    quantity?: number
    custom_field_values?: Record<string, any>
    complementary_product_variants?: string[]
    addon_variants?: string[]
  }
) {
  const { cart } = await sdk.client.fetch<{ cart: any }>(
    `/store/carts/${cartId}/product-builder`,
    {
      method: "POST",
      body: config,
    }
  )
  return cart
}

export async function removeBuilderProductFromCart(
  cartId: string,
  itemId: string
) {
  const { cart } = await sdk.client.fetch<{ cart: any }>(
    `/store/carts/${cartId}/product-builder/${itemId}`,
    {
      method: "DELETE",
    }
  )
  return cart
}
