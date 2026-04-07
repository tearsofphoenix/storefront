"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import ChatbotMessageContent from "./message-content"
import ChatbotInteractiveProductActions from "./interactive-product-actions"
import {
  ChatbotCatalogItem,
  ChatbotCatalogProductDetail,
  ChatbotMessagePart,
} from "./types"

type ChatbotMessagePartsProps = {
  parts: ChatbotMessagePart[]
}

const truncateText = (value: string, maxLength = 220) => {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength).trimEnd()}...`
}

const ChatbotProductPrice = ({
  price,
  originalPrice,
}: {
  price?: string | null
  originalPrice?: string | null
}) => {
  if (!price && !originalPrice) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      {originalPrice && originalPrice !== price && (
        <span className="text-[#9ca3af] line-through">{originalPrice}</span>
      )}
      {price && <span className="font-semibold text-[#111827]">{price}</span>}
    </div>
  )
}

const ChatbotProductMeta = ({
  label,
  value,
}: {
  label: string
  value?: string | null
}) => {
  if (!value) {
    return null
  }

  return (
    <span className="rounded-full bg-[#f8fafc] px-2 py-1 text-[11px] font-medium text-[#4b5563]">
      {label}: {value}
    </span>
  )
}

const ChatbotProductLinkCard = ({
  product,
  labels,
}: {
  product: ChatbotCatalogItem
  labels: {
    viewProduct: string
    collection: string
    type: string
    sale: string
  }
}) => {
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="block rounded-2xl border border-[#e5e7eb] bg-white p-3 transition-colors hover:border-[#cbd5e1] hover:bg-[#fcfcfd]"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 shrink-0">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={[]}
            size="square"
            className="border-[#eef2f7] bg-[#f7f7fa] p-0"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111827]">
                {product.title}
              </p>
              {product.subtitle && (
                <p className="mt-1 text-xs text-[#6b7280]">{product.subtitle}</p>
              )}
            </div>
            {product.on_sale && (
              <span className="shrink-0 rounded-full bg-[#111827] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                {labels.sale}
              </span>
            )}
          </div>
          <ChatbotProductPrice
            price={product.price}
            originalPrice={product.original_price}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <ChatbotProductMeta
              label={labels.collection}
              value={product.collection_title}
            />
            <ChatbotProductMeta label={labels.type} value={product.product_type} />
          </div>
          {product.variant_titles.length > 0 && (
            <p className="mt-2 text-xs text-[#6b7280]">
              {product.variant_titles.slice(0, 2).join(" • ")}
            </p>
          )}
          <p className="mt-3 text-xs font-medium text-[#111827]">
            {labels.viewProduct}
          </p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

const ChatbotProductDetailCard = ({
  product,
  labels,
}: {
  product: ChatbotCatalogProductDetail
  labels: {
    productDetails: string
    viewProduct: string
    collection: string
    type: string
    options: string
    variants: string
  }
}) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
        {labels.productDetails}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <div className="w-20 shrink-0">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={[]}
            size="square"
            className="border-[#eef2f7] bg-[#f7f7fa] p-0"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#111827]">{product.title}</p>
          {product.subtitle && (
            <p className="mt-1 text-xs text-[#6b7280]">{product.subtitle}</p>
          )}
          <ChatbotProductPrice
            price={product.price}
            originalPrice={product.original_price}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <ChatbotProductMeta
              label={labels.collection}
              value={product.collection_title}
            />
            <ChatbotProductMeta label={labels.type} value={product.product_type} />
          </div>
        </div>
      </div>

      {product.description && (
        <p className="mt-3 text-sm leading-6 text-[#4b5563]">
          {truncateText(product.description)}
        </p>
      )}

      {product.option_titles.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
            {labels.options}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.option_titles.map((optionTitle) => (
              <span
                key={`${product.id}-option-${optionTitle}`}
                className="rounded-full bg-[#f8fafc] px-2 py-1 text-[11px] text-[#4b5563]"
              >
                {optionTitle}
              </span>
            ))}
          </div>
        </div>
      )}

      {product.variant_titles.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
            {labels.variants}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variant_titles.slice(0, 6).map((variantTitle) => (
              <span
                key={`${product.id}-variant-${variantTitle}`}
                className="rounded-full bg-[#f8fafc] px-2 py-1 text-[11px] text-[#4b5563]"
              >
                {variantTitle}
              </span>
            ))}
          </div>
        </div>
      )}

      <ChatbotInteractiveProductActions productHandle={product.handle} />

      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="mt-4 inline-flex text-sm font-medium text-[#111827] underline decoration-[#cbd5e1] underline-offset-4"
      >
        {labels.viewProduct}
      </LocalizedClientLink>
    </div>
  )
}

const ChatbotMessageParts = ({ parts }: ChatbotMessagePartsProps) => {
  const { messages } = useI18n()

  if (!parts.length) {
    return null
  }

  const labels = {
    matchingProducts: messages.chatbot.matchingProducts,
    productDetails: messages.chatbot.productDetails,
    viewProduct: messages.chatbot.viewProduct,
    collection: messages.chatbot.collection,
    type: messages.product.type,
    options: messages.chatbot.options,
    variants: messages.chatbot.variants,
    sale: messages.chatbot.sale,
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        const key = `${part.type}-${index}`

        if (part.type === "text") {
          return <ChatbotMessageContent key={key} content={part.text} />
        }

        if (part.type === "product-list") {
          return (
            <div key={key} className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                {labels.matchingProducts}
              </p>
              <div className="space-y-3">
                {part.products.map((product) => (
                  <ChatbotProductLinkCard
                    key={product.id}
                    product={product}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          )
        }

        return (
          <ChatbotProductDetailCard
            key={key}
            product={part.product}
            labels={labels}
          />
        )
      })}
    </div>
  )
}

export default ChatbotMessageParts
