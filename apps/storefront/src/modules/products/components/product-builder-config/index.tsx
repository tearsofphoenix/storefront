"use client"

import { useState, useEffect } from "react"
import { Input, Label, Checkbox, Text, Spinner } from "@medusajs/ui"
import { sdk } from "@lib/config"
import { convertToLocale } from "@lib/util/money"
import type {
  ProductBuilder,
  ProductBuilderCustomField,
  ProductBuilderComplementary,
  ProductBuilderAddon,
  BuilderConfig,
} from "@types/product-builder"

type ProductBuilderConfigProps = {
  productId: string
  regionId: string
  currencyCode: string
  onConfigChange: (config: BuilderConfig) => void
}

export const ProductBuilderConfig = ({
  productId,
  regionId,
  currencyCode,
  onConfigChange,
}: ProductBuilderConfigProps) => {
  const [builder, setBuilder] = useState<ProductBuilder | null>(null)
  const [loading, setLoading] = useState(true)
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({})
  const [selectedComplementary, setSelectedComplementary] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  useEffect(() => {
    if (!productId) return

    sdk.client.fetch<{ product_builder: ProductBuilder }>(
      `/admin/products/${productId}/builder`
    )
      .then(({ product_builder }) => {
        setBuilder(product_builder)
        setLoading(false)
      })
      .catch(() => {
        setBuilder(null)
        setLoading(false)
      })
  }, [productId])

  useEffect(() => {
    onConfigChange({
      custom_field_values: customFieldValues,
      complementary_product_variants: selectedComplementary,
      addon_variants: selectedAddons,
    })
  }, [customFieldValues, selectedComplementary, selectedAddons])

  if (loading) return <Spinner />
  if (!builder) return null

  const hasContent =
    builder.custom_fields.length > 0 ||
    builder.complementary_products.length > 0 ||
    builder.addons.length > 0

  if (!hasContent) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Custom Fields */}
      {builder.custom_fields.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="font-medium text-sm">Customization</Text>
          {builder.custom_fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <Label>
                {field.name}
                {field.is_required && <span className="text-red-500"> *</span>}
              </Label>
              {field.description && (
                <Text className="text-xs text-ui-fg-muted">{field.description}</Text>
              )}
              <Input
                type={field.type === "number" ? "number" : "text"}
                name={field.name}
                placeholder={field.name}
                value={customFieldValues[field.name] || ""}
                onChange={(e) =>
                  setCustomFieldValues((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Complementary Products */}
      {builder.complementary_products.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="font-medium text-sm">Also goes well with</Text>
          {builder.complementary_products.map((cp) => {
            if (!cp.product) return null
            const variant = cp.product.variants?.[0]
            return (
              <label
                key={cp.id}
                className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedComplementary.includes(variant?.id || "")}
                  onCheckedChange={(checked) => {
                    if (checked && variant?.id) {
                      setSelectedComplementary((prev) => [...prev, variant.id])
                    } else {
                      setSelectedComplementary((prev) =>
                        prev.filter((id) => id !== variant?.id)
                      )
                    }
                  }}
                />
                {cp.product.thumbnail && (
                  <img
                    src={cp.product.thumbnail}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <Text className="text-sm">{cp.product.title}</Text>
                  {variant?.calculated_price && (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: variant.calculated_price.calculated_amount,
                        currency_code: currencyCode,
                      })}
                    </Text>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      )}

      {/* Add-ons */}
      {builder.addons.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="font-medium text-sm">Add-ons</Text>
          {builder.addons.map((addon) => {
            if (!addon.product) return null
            const variant = addon.product.variants?.[0]
            return (
              <label
                key={addon.id}
                className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedAddons.includes(variant?.id || "")}
                  onCheckedChange={(checked) => {
                    if (checked && variant?.id) {
                      setSelectedAddons((prev) => [...prev, variant.id])
                    } else {
                      setSelectedAddons((prev) =>
                        prev.filter((id) => id !== variant?.id)
                      )
                    }
                  }}
                />
                {addon.product.thumbnail && (
                  <img
                    src={addon.product.thumbnail}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <Text className="text-sm">{addon.product.title}</Text>
                  {variant?.calculated_price && (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: variant.calculated_price.calculated_amount,
                        currency_code: currencyCode,
                      })}
                    </Text>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
