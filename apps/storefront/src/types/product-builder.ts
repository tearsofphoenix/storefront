export type ProductBuilderCustomField = {
  id: string
  name: string
  type: string
  description?: string | null
  is_required: boolean
}

export type ProductBuilderComplementary = {
  id: string
  product_id: string
  product?: {
    id: string
    title: string
    thumbnail?: string | null
    handle?: string
    images?: { url?: string | null }[] | null
    variants: {
      id: string
      title: string
      calculated_price?: {
        calculated_amount: number
      }
    }[]
  }
}

export type ProductBuilderAddon = {
  id: string
  product_id: string
  product?: {
    id: string
    title: string
    thumbnail?: string | null
    handle?: string
    images?: { url?: string | null }[] | null
    variants: {
      id: string
      title: string
      calculated_price?: {
        calculated_amount: number
      }
    }[]
  }
}

export type ProductBuilder = {
  id: string
  product_id: string
  custom_fields: ProductBuilderCustomField[]
  complementary_products: ProductBuilderComplementary[]
  addons: ProductBuilderAddon[]
}

export type BuilderConfig = {
  custom_field_values: Record<string, string>
  complementary_product_variants: string[]
  addon_variants: string[]
}
