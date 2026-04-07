export type ChatbotProductContextOption = {
  title: string
  value: string
}

export type ChatbotProductContextVariant = {
  id: string
  title: string
  sku?: string | null
  in_stock: boolean
  inventory_quantity?: number | null
  allow_backorder?: boolean
  options: ChatbotProductContextOption[]
  price?: string | null
  original_price?: string | null
  currency_code?: string | null
}

export type ChatbotProductContext = {
  product_id: string
  title: string
  handle: string
  subtitle?: string | null
  description?: string | null
  thumbnail?: string | null
  collection_title?: string | null
  product_type?: string | null
  tags: string[]
  option_titles: string[]
  price_label?: string | null
  original_price_label?: string | null
  currency_code?: string | null
  selected_variant_id?: string | null
  selected_variant_title?: string | null
  selected_variant_sku?: string | null
  selected_variant_options: ChatbotProductContextOption[]
  selected_variant_in_stock?: boolean
  selected_variant_inventory_quantity?: number | null
  variants: ChatbotProductContextVariant[]
}

export type ChatbotSource = {
  type: "faq" | "policy" | "product" | "catalog" | "fallback"
  label: string
}

export type ChatbotCatalogItem = {
  id: string
  title: string
  handle: string
  subtitle?: string | null
  thumbnail?: string | null
  collection_title?: string | null
  product_type?: string | null
  price?: string | null
  original_price?: string | null
  currency_code?: string | null
  on_sale: boolean
  variant_titles: string[]
  tags: string[]
}

export type ChatbotCatalogProductDetail = ChatbotCatalogItem & {
  description?: string | null
  option_titles: string[]
}

export type ChatbotMessagePart =
  | {
      type: "text"
      text: string
    }
  | {
      type: "product-list"
      products: ChatbotCatalogItem[]
    }
  | {
      type: "product-detail"
      product: ChatbotCatalogProductDetail
    }
