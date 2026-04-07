import { HttpTypes } from "@medusajs/types"
import {
  ChatbotProductContext,
  ChatbotProductContextOption,
} from "@modules/layout/components/chatbot-widget/types"
import { getProductPrice, getPricesForVariant } from "./get-product-price"

const isVariantInStock = (variant: HttpTypes.StoreProductVariant) => {
  if (!variant.manage_inventory) {
    return true
  }

  if (variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity || 0) > 0
}

const getOptionTitleMap = (product: HttpTypes.StoreProduct) => {
  return new Map(
    (product.options ?? [])
      .filter((option): option is HttpTypes.StoreProductOption & { id: string } =>
        Boolean(option.id)
      )
      .map((option) => [option.id, option.title ?? option.id])
  )
}

const getVariantOptions = (
  variant: HttpTypes.StoreProductVariant,
  optionTitleMap: Map<string, string>
): ChatbotProductContextOption[] => {
  return (variant.options ?? [])
    .filter((option) => Boolean(option.option_id && option.value))
    .map((option) => ({
      title: optionTitleMap.get(option.option_id!) ?? option.option_id!,
      value: option.value!,
    }))
}

export const buildChatbotProductContext = ({
  product,
  selectedVariantId,
}: {
  product: HttpTypes.StoreProduct
  selectedVariantId?: string
}): ChatbotProductContext => {
  const optionTitleMap = getOptionTitleMap(product)
  const variants = (product.variants ?? []).map((variant) => {
    const price = getPricesForVariant(variant)

    return {
      id: variant.id,
      title: variant.title ?? variant.sku ?? variant.id,
      sku: variant.sku ?? null,
      in_stock: isVariantInStock(variant),
      inventory_quantity: variant.inventory_quantity ?? null,
      allow_backorder: variant.allow_backorder ?? false,
      options: getVariantOptions(variant, optionTitleMap),
      price: price?.calculated_price ?? null,
      original_price: price?.original_price ?? null,
      currency_code: price?.currency_code ?? null,
    }
  })

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    (variants.length === 1 ? variants[0] : null)
  const defaultPrice = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })
  const priceSummary = selectedVariant
    ? defaultPrice.variantPrice ?? defaultPrice.cheapestPrice
    : defaultPrice.cheapestPrice

  return {
    product_id: product.id,
    title: product.title,
    handle: product.handle,
    subtitle: product.subtitle ?? null,
    description: product.description ?? null,
    thumbnail: product.thumbnail ?? null,
    collection_title: product.collection?.title ?? null,
    product_type: product.type?.value ?? null,
    tags: (product.tags ?? []).map((tag) => tag.value ?? tag.id).filter(Boolean),
    option_titles: (product.options ?? [])
      .map((option) => option.title ?? option.id)
      .filter(Boolean) as string[],
    price_label: priceSummary?.calculated_price ?? null,
    original_price_label: priceSummary?.original_price ?? null,
    currency_code: priceSummary?.currency_code ?? null,
    selected_variant_id: selectedVariant?.id ?? null,
    selected_variant_title: selectedVariant?.title ?? null,
    selected_variant_sku: selectedVariant?.sku ?? null,
    selected_variant_options: selectedVariant?.options ?? [],
    selected_variant_in_stock: selectedVariant?.in_stock,
    selected_variant_inventory_quantity:
      selectedVariant?.inventory_quantity ?? null,
    variants,
  }
}
