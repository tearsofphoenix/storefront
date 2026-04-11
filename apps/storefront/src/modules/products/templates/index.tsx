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
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
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
  const theme = getStorefrontThemePresentation()
  const isPorto = theme.themePresetKey === "porto"
  const hasInlineCommerceCallout = Boolean(
    contentBlocks?.some((block) => block.blockType === "commerce-callout")
  )

  return (
    <>
      <ChatbotContextSync productContext={chatbotProductContext} />
      {!hasInlineCommerceCallout ? (
        <div
          className="content-container py-12 small:py-14"
          data-testid="product-container"
        >
          <div
            className={
              isPorto
                ? "grid gap-8 small:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] small:items-start"
                : "grid gap-10 small:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] small:items-start"
            }
          >
            <div className="min-w-0">
              <ImageGallery images={images} />
            </div>
            <div
              className={
                isPorto
                  ? "grid gap-6 small:sticky small:top-24"
                  : "grid gap-8 small:sticky small:top-20"
              }
            >
              {isPorto ? (
                <div className="grid gap-3 rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface-soft)] p-4 small:grid-cols-3">
                  <div className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                      Variants
                    </span>
                    <span className="text-lg font-semibold text-[var(--pi-text)]">
                      {(product.variants ?? []).length}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                      Gallery
                    </span>
                    <span className="text-lg font-semibold text-[var(--pi-text)]">
                      {images.length} frames
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                      Collection
                    </span>
                    <span className="text-lg font-semibold text-[var(--pi-text)]">
                      {product.collection?.title ?? "General"}
                    </span>
                  </div>
                </div>
              ) : null}
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
        <div
          className={
            hasInlineCommerceCallout
              ? "pt-0"
              : "mt-16 border-t border-[var(--pi-border)] pt-12"
          }
        >
          <BlockRenderer
            blocks={contentBlocks}
            images={images}
            product={product}
            productsByHandle={contentProductsByHandle}
            region={region}
          />
        </div>
      ) : null}
      <div className="content-container mt-14 border-t border-[var(--pi-border)] pt-10">
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
        className="content-container my-16 border-t border-[var(--pi-border)] pt-10 small:my-24"
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
