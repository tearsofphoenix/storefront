"use client"

import { useEffect, useMemo, useState } from "react"
import { Checkbox, Input, Label, Select, Text } from "@medusajs/ui"

import { useI18n } from "@lib/i18n/use-i18n"
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

const isMeaningfulVariantTitle = (title?: string | null) => {
  if (!title) {
    return false
  }

  return title.trim().toLowerCase() !== "default variant"
}

const getSelectedVariant = <
  T extends {
    id: string
    title: string
    calculated_price?: {
      calculated_amount: number
    }
  },
>(
  variants: T[],
  selectedVariantId?: string
) => {
  return variants.find((variant) => variant.id === selectedVariantId) ?? variants[0]
}

export const ProductBuilderConfig = ({
  builder,
  currencyCode,
  onConfigChange,
}: ProductBuilderConfigProps) => {
  const { messages } = useI18n()
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>(
    {}
  )
  const [selectedComplementary, setSelectedComplementary] = useState<
    Record<string, string>
  >({})
  const [selectedAddons, setSelectedAddons] = useState<Record<string, string>>({})

  useEffect(() => {
    setCustomFieldValues({})
    setSelectedComplementary({})
    setSelectedAddons({})
  }, [builder?.id])

  useEffect(() => {
    onConfigChange({
      custom_field_values: customFieldValues,
      complementary_product_variants: Object.values(selectedComplementary),
      addon_variants: Object.values(selectedAddons),
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
            {messages.product.builderCustomization}
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
            {messages.product.builderComplementaryProducts}
          </Text>
          {builder.complementary_products.map((item) => {
            if (!item.product) {
              return null
            }

            const variant = item.product.variants?.[0]

            if (!variant) {
              return null
            }

            const selectedVariant = getSelectedVariant(
              item.product.variants,
              selectedComplementary[item.id]
            )

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 border border-[var(--pi-border)] bg-[var(--pi-surface)] p-3"
              >
                <Checkbox
                  checked={Boolean(selectedComplementary[item.id])}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedComplementary((prev) =>
                        prev[item.id]
                          ? prev
                          : {
                              ...prev,
                              [item.id]: variant.id,
                            }
                      )
                      return
                    }

                    setSelectedComplementary((prev) =>
                      Object.fromEntries(
                        Object.entries(prev).filter(([key]) => key !== item.id)
                      )
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
                  {item.product.variants.length > 1 ? (
                    <Select
                      value={selectedComplementary[item.id] || selectedVariant.id}
                      disabled={!selectedComplementary[item.id]}
                      onValueChange={(value) =>
                        setSelectedComplementary((prev) => ({
                          ...prev,
                          [item.id]: value,
                        }))
                      }
                    >
                      <Select.Trigger>
                        <Select.Value placeholder={messages.product.builderSelectVariant} />
                      </Select.Trigger>
                      <Select.Content>
                        {item.product.variants.map((productVariant) => (
                          <Select.Item key={productVariant.id} value={productVariant.id}>
                            {productVariant.title}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  ) : isMeaningfulVariantTitle(selectedVariant.title) ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {selectedVariant.title}
                    </Text>
                  ) : null}
                  {selectedVariant.calculated_price ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: selectedVariant.calculated_price.calculated_amount,
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
          <Text className="text-sm font-medium text-[var(--pi-text)]">
            {messages.product.builderAddons}
          </Text>
          {builder.addons.map((item) => {
            if (!item.product) {
              return null
            }

            const variant = item.product.variants?.[0]

            if (!variant) {
              return null
            }

            const selectedVariant = getSelectedVariant(
              item.product.variants,
              selectedAddons[item.id]
            )

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 border border-[var(--pi-border)] bg-[var(--pi-surface)] p-3"
              >
                <Checkbox
                  checked={Boolean(selectedAddons[item.id])}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAddons((prev) =>
                        prev[item.id]
                          ? prev
                          : {
                              ...prev,
                              [item.id]: variant.id,
                            }
                      )
                      return
                    }

                    setSelectedAddons((prev) =>
                      Object.fromEntries(
                        Object.entries(prev).filter(([key]) => key !== item.id)
                      )
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
                  {item.product.variants.length > 1 ? (
                    <Select
                      value={selectedAddons[item.id] || selectedVariant.id}
                      disabled={!selectedAddons[item.id]}
                      onValueChange={(value) =>
                        setSelectedAddons((prev) => ({
                          ...prev,
                          [item.id]: value,
                        }))
                      }
                    >
                      <Select.Trigger>
                        <Select.Value placeholder={messages.product.builderSelectVariant} />
                      </Select.Trigger>
                      <Select.Content>
                        {item.product.variants.map((productVariant) => (
                          <Select.Item key={productVariant.id} value={productVariant.id}>
                            {productVariant.title}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  ) : isMeaningfulVariantTitle(selectedVariant.title) ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {selectedVariant.title}
                    </Text>
                  ) : null}
                  {selectedVariant.calculated_price ? (
                    <Text className="text-xs text-ui-fg-muted">
                      {convertToLocale({
                        amount: selectedVariant.calculated_price.calculated_amount,
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
