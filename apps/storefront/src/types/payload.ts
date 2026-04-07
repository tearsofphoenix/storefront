export type PayloadMedia = {
  id?: string
  alt?: string | null
  caption?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
}

export type PayloadCTA = {
  label?: string | null
  href?: string | null
}

export type PayloadBlockBase = {
  id?: string
  anchorId?: string | null
}

export type PayloadHeroBlock = {
  id?: string
  blockType: "hero"
  anchorId?: string | null
  eyebrow?: string | null
  headline: string
  subheadline?: string | null
  mediaType?: "image" | "video" | null
  backgroundImage?: PayloadMedia | null
  backgroundVideo?: PayloadMedia | null
  primaryCTA?: PayloadCTA | null
  secondaryCTA?: PayloadCTA | null
}

export type PayloadFeatureGridBlock = {
  id?: string
  blockType: "feature-grid"
  anchorId?: string | null
  title?: string | null
  description?: string | null
  items?: Array<{
    id?: string
    title: string
    description?: string | null
    image?: PayloadMedia | null
  }> | null
}

export type PayloadMediaStoryBlock = {
  id?: string
  blockType: "media-story"
  anchorId?: string | null
  eyebrow?: string | null
  title: string
  body: string
  mediaPosition?: "left" | "right" | null
  media?: PayloadMedia | null
}

export type PayloadSpecTableBlock = {
  id?: string
  blockType: "spec-table"
  anchorId?: string | null
  title?: string | null
  rows?: Array<{
    id?: string
    label: string
    value: string
  }> | null
}

export type PayloadFaqBlock = {
  id?: string
  blockType: "faq"
  anchorId?: string | null
  title?: string | null
  items?: Array<{
    id?: string
    question: string
    answer: string
  }> | null
}

export type PayloadCtaBlock = {
  id?: string
  blockType: "cta"
  anchorId?: string | null
  title: string
  description?: string | null
  primaryCTA?: PayloadCTA | null
  secondaryCTA?: PayloadCTA | null
}

export type PayloadSectionNavBlock = {
  id?: string
  blockType: "section-nav"
  title?: string | null
  items?: Array<{
    id?: string
    label: string
    anchorId: string
  }> | null
}

export type PayloadComparisonTableBlock = {
  id?: string
  blockType: "comparison-table"
  anchorId?: string | null
  eyebrow?: string | null
  title: string
  description?: string | null
  leftColumnLabel: string
  rightColumnLabel: string
  rows?: Array<{
    id?: string
    feature: string
    leftValue: string
    rightValue: string
    emphasis?: "none" | "left" | "right" | null
  }> | null
}

export type PayloadQuoteShowcaseBlock = {
  id?: string
  blockType: "quote-showcase"
  anchorId?: string | null
  eyebrow?: string | null
  quote: string
  author: string
  role?: string | null
  avatar?: PayloadMedia | null
  highlight?: string | null
}

export type PayloadCommerceCalloutBlock = {
  id?: string
  blockType: "commerce-callout"
  anchorId?: string | null
  eyebrow?: string | null
  supportingText?: string | null
  imagePosition?: "left" | "right" | null
  showImage?: boolean | null
}

export type PayloadContentBlock =
  | PayloadSectionNavBlock
  | PayloadHeroBlock
  | PayloadCommerceCalloutBlock
  | PayloadFeatureGridBlock
  | PayloadMediaStoryBlock
  | PayloadComparisonTableBlock
  | PayloadQuoteShowcaseBlock
  | PayloadSpecTableBlock
  | PayloadFaqBlock
  | PayloadCtaBlock

export type PayloadSeo = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: PayloadMedia | null
}

export type PayloadProductPage = {
  id: string
  title: string
  slug: string
  handle: string
  status?: "draft" | "published"
  syncStatus?: "active" | "deleted"
  seo?: PayloadSeo | null
  sections?: PayloadContentBlock[] | null
}

export type PayloadLandingPage = {
  id: string
  title: string
  slug: string
  status?: "draft" | "published"
  seo?: PayloadSeo | null
  sections?: PayloadContentBlock[] | null
}

export type PayloadSiteSettings = {
  siteName?: string | null
  announcementBar?: {
    enabled?: boolean | null
    text?: string | null
    linkLabel?: string | null
    linkHref?: string | null
  } | null
  defaultSeo?: PayloadSeo | null
}

export type PayloadFindResponse<T> = {
  docs: T[]
}
