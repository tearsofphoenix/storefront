import { HttpTypes } from "@medusajs/types"
import { PayloadBundleGridBlock } from "types/payload"

import { CmsProductCard } from "./cms-product-card"

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
    <section className="content-container py-12 small:py-16">
      <div className="rounded-[2rem] bg-[#f1e9de] px-6 py-8 small:px-8">
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
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
