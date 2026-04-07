import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getI18n } from "@lib/i18n/server"
import { getRegion } from "@lib/data/regions"
import { getLandingPageBySlug } from "@lib/payload/get-landing-page"
import { getPayloadMediaUrl } from "@lib/payload/client"
import { getSiteSettings } from "@lib/payload/get-site-settings"
import { BlockRenderer } from "@modules/content/blocks/block-renderer"

export async function generateMetadata(): Promise<Metadata> {
  const [{ messages }, landingPage, siteSettings] = await Promise.all([
    getI18n(),
    getLandingPageBySlug("home"),
    getSiteSettings(),
  ])

  const fallbackTitle =
    siteSettings?.defaultSeo?.metaTitle?.trim() ||
    messages.home.metadataTitle
  const fallbackDescription =
    siteSettings?.defaultSeo?.metaDescription?.trim() ||
    messages.home.metadataDescription
  const ogImage =
    getPayloadMediaUrl(landingPage?.seo?.ogImage?.url) ||
    getPayloadMediaUrl(siteSettings?.defaultSeo?.ogImage?.url) ||
    undefined

  return {
    title: landingPage?.seo?.metaTitle?.trim() || fallbackTitle,
    description:
      landingPage?.seo?.metaDescription?.trim() || fallbackDescription,
    openGraph: {
      title: landingPage?.seo?.metaTitle?.trim() || fallbackTitle,
      description:
        landingPage?.seo?.metaDescription?.trim() || fallbackDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const [region, landingPage] = await Promise.all([
    getRegion(countryCode),
    getLandingPageBySlug("home"),
  ])

  if (!region) {
    return null
  }

  if (landingPage?.sections?.length) {
    return <BlockRenderer blocks={landingPage.sections} />
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections) {
    return null
  }

  return (
    <>
      <Hero collection={collections[0] ?? null} region={region} />
      <FeaturedProducts
        collections={collections.slice(0, 1)}
        region={region}
      />
    </>
  )
}
