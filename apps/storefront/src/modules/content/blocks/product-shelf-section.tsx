import { HttpTypes } from "@medusajs/types"
import { PayloadProductShelfBlock } from "types/payload"

import { CmsProductCard } from "./cms-product-card"

type ProductShelfSectionProps = PayloadProductShelfBlock & {
  productsByHandle?: Record<string, HttpTypes.StoreProduct>
}

export const ProductShelfSection = ({
  description,
  eyebrow,
  items,
  productsByHandle,
  title,
}: ProductShelfSectionProps) => {
  const productItems =
    items?.flatMap((item) => {
      const product = productsByHandle?.[item.productHandle]

      if (!product) {
        return []
      }

      return [
        {
          ...item,
          product,
        },
      ]
    }) ?? []

  if (!productItems.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="flex flex-col gap-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="max-w-3xl whitespace-pre-line text-base leading-7 text-[#4b5563]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-8 grid gap-5 small:grid-cols-2 xl:grid-cols-4">
        {productItems.map((item, index) => (
          <CmsProductCard
            key={item.id || `${item.product.handle}-${index}`}
            badge={item.badge}
            description={item.description}
            product={item.product}
            variant="shelf"
          />
        ))}
      </div>
    </section>
  )
}
