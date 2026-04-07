import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"
import ProductInfo from "@modules/products/templates/product-info"
import { PayloadCommerceCalloutBlock } from "types/payload"

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
    <section className="content-container py-12 small:py-16">
      <div
        className={`grid gap-8 rounded-[2rem] border border-[#e5e7eb] bg-[#f8fafc] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] small:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] lg:items-start ${
          imageFirst ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        {showImage !== false ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white">
            {imageUrl ? (
              <img
                alt={product.title}
                className="aspect-[4/3] w-full object-cover"
                src={imageUrl}
              />
            ) : (
              <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#f8fafc)] text-sm text-[#6b7280]">
                Product media
              </div>
            )}
          </div>
        ) : (
          <div />
        )}
        <div className="flex flex-col gap-5">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
              {eyebrow}
            </p>
          ) : null}
          <ProductInfo product={product} />
          {supportingText ? (
            <p className="whitespace-pre-line text-sm leading-7 text-[#4b5563]">
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
