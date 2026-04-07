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

export type PayloadHeroBlock = {
  id?: string
  blockType: "hero"
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
  eyebrow?: string | null
  title: string
  body: string
  mediaPosition?: "left" | "right" | null
  media?: PayloadMedia | null
}

export type PayloadSpecTableBlock = {
  id?: string
  blockType: "spec-table"
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
  title: string
  description?: string | null
  primaryCTA?: PayloadCTA | null
  secondaryCTA?: PayloadCTA | null
}

export type PayloadContentBlock =
  | PayloadHeroBlock
  | PayloadFeatureGridBlock
  | PayloadMediaStoryBlock
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
