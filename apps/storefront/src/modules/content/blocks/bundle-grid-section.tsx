import { HttpTypes } from "@medusajs/types"
import { PayloadBundleGridBlock } from "types/payload"

import { CmsProductCard } from "./cms-product-card"
import { sectionStyles } from "./section-styles"

type BundleGridSectionProps = PayloadBundleGridBlock & {
  productsByHandle?: Record<string, HttpTypes.StoreProduct>
}

export const BundleGridSection = ({
  bundles,
  description,
  eyebrow,
  productsByHandle,
  title,
}: BundleGridSectionProps) => {
  const bundleItems =
    bundles?.flatMap((bundle) => {
      const product = productsByHandle?.[bundle.productHandle]

      if (!product) {
        return []
      }

      return [
        {
          ...bundle,
          product,
        },
      ]
    }) ?? []

  if (!bundleItems.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className={`${sectionStyles.surface} ${sectionStyles.inset}`}>
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
        <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} lg:grid-cols-2`}>
          {bundleItems.map((bundle, index) => (
            <CmsProductCard
              key={bundle.id || `${bundle.product.handle}-${index}`}
              badge={bundle.badge}
              ctaLabel={bundle.ctaLabel}
              description={bundle.description}
              highlight={bundle.highlight}
              product={bundle.product}
              variant="bundle"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
