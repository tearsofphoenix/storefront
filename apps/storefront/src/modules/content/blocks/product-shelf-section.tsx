import { HttpTypes } from "@medusajs/types"
import { PayloadProductShelfBlock } from "types/payload"

import { CmsProductCard } from "./cms-product-card"
import { sectionStyles } from "./section-styles"

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
    <section className={sectionStyles.section}>
      <div className={sectionStyles.stackMd}>
        {eyebrow ? (
          <p className={sectionStyles.eyebrow}>
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className={sectionStyles.title}>
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className={`max-w-3xl whitespace-pre-line ${sectionStyles.body}`}>
            {description}
          </p>
        ) : null}
      </div>
      <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} small:grid-cols-2 xl:grid-cols-4`}>
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
