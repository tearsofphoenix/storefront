import { PayloadContentBlock } from "types/payload"

import { CTASection } from "./cta-section"
import { FAQSection } from "./faq-section"
import { FeatureGridSection } from "./feature-grid-section"
import { HeroSection } from "./hero-section"
import { MediaStorySection } from "./media-story-section"
import { SpecTableSection } from "./spec-table-section"

type BlockRendererProps = {
  blocks?: PayloadContentBlock[] | null
}

export const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  if (!blocks?.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `${block.blockType}-${index}`

        switch (block.blockType) {
          case "hero":
            return <HeroSection key={key} {...block} />
          case "feature-grid":
            return <FeatureGridSection key={key} {...block} />
          case "media-story":
            return <MediaStorySection key={key} {...block} />
          case "spec-table":
            return <SpecTableSection key={key} {...block} />
          case "faq":
            return <FAQSection key={key} {...block} />
          case "cta":
            return <CTASection key={key} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
