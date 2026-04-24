import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import ProductInfo from "@modules/products/templates/product-info"
import { PayloadCommerceCalloutBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

type CommerceCalloutSectionProps = PayloadCommerceCalloutBlock & {
  images: HttpTypes.StoreProductImage[]
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export const CommerceCalloutSection = ({
  eyebrow,
  imagePosition,
  images,
  product,
  region,
  showImage,
  supportingText,
}: CommerceCalloutSectionProps) => {
  const leadImage = images[0] || product.images?.[0]
  const imageUrl = leadImage?.url || product.thumbnail || null
  const imageFirst = imagePosition === "left"

  return (
    <section className={sectionStyles.section}>
      <div
        className={`grid ${sectionStyles.sectionGridGap} ${sectionStyles.surface} ${sectionStyles.inset} lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] lg:items-start ${
          imageFirst ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        {showImage !== false ? (
          <div className="overflow-hidden rounded-xl border border-black/12 bg-[#f3f3f3]">
            {imageUrl ? (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  alt={product.title}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                src={imageUrl}
              />
            </div>
          ) : (
              <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#f0f0f0,#fafafa)] text-sm text-[#6f6f6f]">
                Product media
              </div>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className={sectionStyles.stackLg}>
          {eyebrow ? (
            <p className={sectionStyles.eyebrow}>
              {eyebrow}
            </p>
          ) : null}
          <ProductInfo product={product} />
          {supportingText ? (
            <p className="whitespace-pre-line text-sm leading-7 text-[#4b4b4b]">
              {supportingText}
            </p>
          ) : null}
          <Suspense
            fallback={<ProductActions disabled={true} product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
