import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductReviewsPlugin from "@modules/products/components/product-reviews-plugin"
import StorefrontPluginHighlights from "@modules/products/components/storefront-plugin-highlights"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { isStorefrontPluginEnabled } from "@lib/util/plugin-manifest"
import { buildChatbotProductContext } from "@lib/util/chatbot-product-context"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { PayloadContentBlock } from "types/payload"
import ChatbotContextSync from "../components/chatbot-context-sync"
import { BlockRenderer } from "@modules/content/blocks/block-renderer"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  contentProductsByHandle?: Record<string, HttpTypes.StoreProduct>
  images: HttpTypes.StoreProductImage[]
  selectedVariantId?: string
  contentBlocks?: PayloadContentBlock[] | null
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  contentBlocks,
  product,
  region,
  countryCode,
  contentProductsByHandle,
  images,
  selectedVariantId,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const chatbotProductContext = buildChatbotProductContext({
    product,
    selectedVariantId,
  })
  const hasInlineCommerceCallout = Boolean(
    contentBlocks?.some((block) => block.blockType === "commerce-callout")
  )

  return (
    <>
      <ChatbotContextSync productContext={chatbotProductContext} />
      {!hasInlineCommerceCallout ? (
        <div
          className="content-container py-10 small:py-12"
          data-testid="product-container"
        >
          <div className="grid gap-10 small:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] small:items-start">
            <div className="min-w-0">
              <ImageGallery images={images} />
            </div>
            <div className="grid gap-8 small:sticky small:top-24">
              <ProductInfo product={product} />
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
              <ProductOnboardingCta />
            </div>
          </div>
        </div>
      ) : null}
      {contentBlocks?.length ? (
        <div className={hasInlineCommerceCallout ? "pt-0" : "mt-14 border-t border-[#e5e7eb] pt-10"}>
          <BlockRenderer
            blocks={contentBlocks}
            images={images}
            product={product}
            productsByHandle={contentProductsByHandle}
            region={region}
          />
        </div>
      ) : null}
      <div className="content-container mt-12 border-t border-[#e5e7eb] pt-8">
        <ProductTabs product={product} />
      </div>
      {isStorefrontPluginEnabled("reviews") ? (
        <div
          className="content-container mb-12"
          data-testid="product-reviews-plugin-container"
        >
          <ProductReviewsPlugin product={product} />
        </div>
      ) : null}
      <div className="content-container mb-12">
        <StorefrontPluginHighlights />
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
