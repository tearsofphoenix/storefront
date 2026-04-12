"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import { Text } from "@medusajs/ui"

type BuilderFieldValue = {
  field_id?: string
  name?: string
  value?: unknown
}

type LineItemBuilderDetailsProps = {
  metadata?: Record<string, unknown> | null
  compact?: boolean
}

const getFieldLabel = (field: BuilderFieldValue) => {
  return field.name?.trim() || field.field_id?.trim()
}

const LineItemBuilderDetails = ({
  metadata,
  compact = false,
}: LineItemBuilderDetailsProps) => {
  const { messages } = useI18n()
  const customFields = Array.isArray(metadata?.custom_fields)
    ? (metadata.custom_fields as BuilderFieldValue[])
    : []

  const isBuilderMainProduct = metadata?.is_builder_main_product === true
  const isLinkedBuilderItem = Boolean(metadata?.main_product_line_item_id)
  const isAddon = metadata?.is_addon === true

  if (!isBuilderMainProduct && !isLinkedBuilderItem) {
    return null
  }

  return (
    <div className="mt-2 flex flex-col gap-1">
      {isBuilderMainProduct ? (
        <Text
          className={compact ? "text-xs text-ui-fg-muted" : "text-xs text-ui-fg-muted"}
        >
          {messages.product.builderCustomizedProduct}
        </Text>
      ) : (
        <Text
          className={compact ? "text-xs text-ui-fg-muted" : "text-xs text-ui-fg-muted"}
        >
          {isAddon
            ? messages.product.builderAddonItem
            : messages.product.builderComplementaryItem}
        </Text>
      )}
      {customFields.map((field, index) => (
        <Text
          key={`${field.field_id || field.name || "field"}-${index}`}
          className={compact ? "text-xs text-ui-fg-subtle" : "text-xs text-ui-fg-subtle"}
        >
          {getFieldLabel(field) || messages.product.builderCustomization}:{" "}
          {String(field.value ?? "")}
        </Text>
      ))}
    </div>
  )
}

export default LineItemBuilderDetails
