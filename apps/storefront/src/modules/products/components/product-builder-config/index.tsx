"use client"

import { useEffect, useMemo, useState } from "react"
import { Checkbox, Input, Label, Text } from "@medusajs/ui"

import { convertToLocale } from "@lib/util/money"
import Thumbnail from "@modules/products/components/thumbnail"
import type { BuilderConfig, ProductBuilder } from "@types/product-builder"

type ProductBuilderConfigProps = {
  builder: ProductBuilder | null
  currencyCode: string
  onConfigChange: (config: BuilderConfig) => void
}

const emptyConfig: BuilderConfig = {
  custom_field_values: {},
  complementary_product_variants: [],
  addon_variants: [],
}

export const ProductBuilderConfig = ({
  builder,
  currencyCode,
  onConfigChange,
}: ProductBuilderConfigProps) => {
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>(
    {}
  )
  const [selectedComplementary, setSelectedComplementary] = useState<string[]>([])
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  useEffect(() => {
    setCustomFieldValues({})
    setSelectedComplementary([])
    setSelectedAddons([])
  }, [builder?.id])

  useEffect(() => {
    onConfigChange({
      custom_field_values: customFieldValues,
      complementary_product_variants: selectedComplementary,
      addon_variants: selectedAddons,
    })
  }, [customFieldValues, onConfigChange, selectedAddons, selectedComplementary])

  const hasContent = useMemo(() => {
    if (!builder) {
      return false
    }

    return (
      builder.custom_fields.length > 0 ||
      builder.complementary_products.length > 0 ||
      builder.addons.length > 0
    )
  }, [builder])

  if (!builder || !hasContent) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 border border-[var(--pi-border)] bg-[var(--pi-bg)] p-5">
      {builder.custom_fields.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="text-sm font-medium text-[var(--pi-text)]">
            Customization
          </Text>
          {builder.custom_fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <Label className="text-sm text-[var(--pi-text)]">
                {field.name}
                {field.is_required ? (
                  <span className="text-ui-fg-error"> *</span>
                ) : null}
              </Label>
              {field.description ? (
                <Text className="text-xs text-ui-fg-muted">{field.description}</Text>
              ) : null}
              <Input
                type={field.type === "number" ? "number" : "text"}
                name={field.id}
                placeholder={field.name}
                value={customFieldValues[field.id] || ""}
                onChange={(event) =>
                  setCustomFieldValues((prev) => ({
                    ...prev,
                    [field.id]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}

      {builder.complementary_products.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="text-sm font-medium text-[var(--pi-text)]">
            Also goes well with
          </Text>
          {builder.complementary_products.map((item) => {
            if (!item.product) {
              return null
            }

            const variant = item.product.variants?.[0]

            if (!variant) {
              return null
            }

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 border border-[var(--pi-border)] bg-[var(--pi-surface)] p-3"
              >
                <Checkbox
                  checked={selectedComplementary.includes(variant.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedComplementary((prev) =>
                        prev.includes(variant.id) ? prev : [...prev, variant.id]
                      )
                      return
                    }

                    setSelectedComplementary((prev) =>
                      prev.filter((id) => id !== variant.id)
                    )
                  }}
                />
                <div className="w-14">
                  <Thumbnail
                    thumbnail={item.product.thumbnail}
                    images={item.product.images}
                    alt={item.product.title}
                    size="square"
                    className="p-0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Text className="text-sm text-[var(--pi-text)]">
                    {item.product.title}
                  </Text>
                  <Text className="text-xs text-ui-fg-muted">{variant.title}</Text>
                  {variant.calculated_price ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: variant.calculated_price.calculated_amount,
                        currency_code: currencyCode,
                      })}
                    </Text>
                  ) : null}
                </div>
              </label>
            )
          })}
        </div>
      )}

      {builder.addons.length > 0 && (
        <div className="flex flex-col gap-3">
          <Text className="text-sm font-medium text-[var(--pi-text)]">Add-ons</Text>
          {builder.addons.map((item) => {
            if (!item.product) {
              return null
            }

            const variant = item.product.variants?.[0]

            if (!variant) {
              return null
            }

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 border border-[var(--pi-border)] bg-[var(--pi-surface)] p-3"
              >
                <Checkbox
                  checked={selectedAddons.includes(variant.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAddons((prev) =>
                        prev.includes(variant.id) ? prev : [...prev, variant.id]
                      )
                      return
                    }

                    setSelectedAddons((prev) =>
                      prev.filter((id) => id !== variant.id)
                    )
                  }}
                />
                <div className="w-14">
                  <Thumbnail
                    thumbnail={item.product.thumbnail}
                    images={item.product.images}
                    alt={item.product.title}
                    size="square"
                    className="p-0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Text className="text-sm text-[var(--pi-text)]">
                    {item.product.title}
                  </Text>
                  <Text className="text-xs text-ui-fg-muted">{variant.title}</Text>
                  {variant.calculated_price ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: variant.calculated_price.calculated_amount,
                        currency_code: currencyCode,
                      })}
                    </Text>
                  ) : null}
                </div>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductBuilderConfig
export { emptyConfig as emptyBuilderConfig }
