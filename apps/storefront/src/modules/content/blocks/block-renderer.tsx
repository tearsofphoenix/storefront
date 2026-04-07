import { HttpTypes } from "@medusajs/types"
import { PayloadContentBlock } from "types/payload"

import { CommerceCalloutSection } from "./commerce-callout-section"
import { ComparisonTableSection } from "./comparison-table-section"
import { CTASection } from "./cta-section"
import { FAQSection } from "./faq-section"
import { FeatureGridSection } from "./feature-grid-section"
import { HeroSection } from "./hero-section"
import { MediaStorySection } from "./media-story-section"
import { QuoteShowcaseSection } from "./quote-showcase-section"
import { SectionNav } from "./section-nav"
import { SpecTableSection } from "./spec-table-section"

type BlockRendererProps = {
  blocks?: PayloadContentBlock[] | null
  images?: HttpTypes.StoreProductImage[]
  product?: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
}

export const BlockRenderer = ({
  blocks,
  images,
  product,
  region,
}: BlockRendererProps) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `${block.blockType}-${index}`
        const anchorId = "anchorId" in block ? block.anchorId : null

        switch (block.blockType) {
          case "section-nav":
            return <SectionNav key={key} {...block} />
          case "hero":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <HeroSection {...block} />
              </div>
            )
          case "commerce-callout":
            if (!product || !region) {
              return null
            }

            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <CommerceCalloutSection
                  {...block}
                  images={images ?? []}
                  product={product}
                  region={region}
                />
              </div>
            )
          case "feature-grid":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <FeatureGridSection {...block} />
              </div>
            )
          case "media-story":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <MediaStorySection {...block} />
              </div>
            )
          case "comparison-table":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <ComparisonTableSection {...block} />
              </div>
            )
          case "quote-showcase":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <QuoteShowcaseSection {...block} />
              </div>
            )
          case "spec-table":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <SpecTableSection {...block} />
              </div>
            )
          case "faq":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <FAQSection {...block} />
              </div>
            )
          case "cta":
            return (
              <div id={anchorId || undefined} key={key} className="scroll-mt-32">
                <CTASection {...block} />
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}
