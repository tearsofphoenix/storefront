import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
  toRgba,
} from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type CollectionSpotlightsProps = {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export default async function CollectionSpotlights({
  collections,
  region,
}: CollectionSpotlightsProps) {
  const { messages } = await getI18n()
  const spotlightCollections = collections.slice(0, 3)

  if (!spotlightCollections.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-20">
      <div className="mb-8 grid gap-4 small:grid-cols-[1fr_auto] small:items-end">
        <div className="grid gap-3">
          <span className="theme-eyebrow">{messages.home.editorialCollections}</span>
          <div className="grid gap-2">
            <h2 className="text-3xl leading-tight small:text-5xl">
              {messages.home.calmMerchHeading}
            </h2>
            <p className="max-w-[42rem] text-base leading-7 text-grey-60 small:text-lg">
              {messages.home.calmMerchDescription}
            </p>
          </div>
        </div>
        <LocalizedClientLink href="/store" className="theme-outline-button">
          {messages.common.browseAllProducts}
        </LocalizedClientLink>
      </div>

      <div className="grid gap-6">
        {spotlightCollections.map((collection, index) => (
          <CollectionSpotlight
            key={collection.id}
            collection={collection}
            index={index}
            region={region}
          />
        ))}
      </div>
    </section>
  )
}

async function CollectionSpotlight({
  collection,
  index,
  region,
}: {
  collection: HttpTypes.StoreCollection
  index: number
  region: HttpTypes.StoreRegion
}) {
  const { messages, t } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: 3,
      fields: "*variants.calculated_price,+metadata,+tags",
    },
  })

  const primaryProduct = products[0]
  const secondaryProducts = products.slice(1, 3)
  const reversed = index % 2 === 1

  if (!primaryProduct) {
    return null
  }

  return (
    <article
      className="overflow-hidden rounded-[32px] border"
      style={{
        background:
          index % 2 === 0
            ? `linear-gradient(180deg, ${theme.navBackground} 0%, rgba(255,255,255,0.92) 100%)`
            : `linear-gradient(180deg, rgba(255,255,255,0.92) 0%, ${theme.footerBackground} 100%)`,
        borderColor: toRgba(theme.primaryColor, 0.1),
        boxShadow: `0 18px 40px ${toRgba(theme.primaryColor, 0.08)}`,
      }}
    >
      <div className="grid gap-8 p-6 small:grid-cols-[0.95fr_1.05fr] small:items-center small:p-10">
        <div
          className={`grid gap-4 ${reversed ? "small:order-2" : ""}`}
          style={{
            color: "#111827",
          }}
        >
          <span className="theme-eyebrow" style={{ color: theme.primaryColor }}>
            {messages.home.featuredCollection}
          </span>
          <div className="grid gap-3">
            <h3
              className="text-3xl leading-tight small:text-5xl"
              style={{ fontFamily: theme.headingFontFamily }}
            >
              {collection.title}
            </h3>
            <p
              className="max-w-[32rem] text-base leading-7 text-grey-60 small:text-lg"
              style={{ fontFamily: theme.bodyFontFamily }}
            >
              {t(messages.home.collectionStory, {
                name: collection.title.toLowerCase(),
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {products.slice(0, 3).map((product) => (
              <span
                key={product.id}
                className="rounded-full px-4 py-2 text-sm"
                style={{
                  background: "rgba(255,255,255,0.76)",
                  border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
                  color: "#374151",
                }}
              >
                {product.title}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="theme-solid-button"
              style={{
                background: theme.buttonFillColor,
                color: theme.buttonTextColor,
              }}
            >
              {messages.home.viewCollection}
            </LocalizedClientLink>
            {primaryProduct.handle ? (
              <LocalizedClientLink
                href={`/products/${primaryProduct.handle}`}
                className="theme-outline-button"
              >
                {messages.home.exploreFeaturedProduct}
              </LocalizedClientLink>
            ) : null}
          </div>
        </div>

        <div
          className={`relative min-h-[280px] small:min-h-[360px] ${
            reversed ? "small:order-1" : ""
          }`}
        >
          <div
            className="absolute inset-0 rounded-[28px]"
            style={{
              background: `linear-gradient(135deg, ${toRgba(
                theme.accentColor,
                0.34
              )}, rgba(255,255,255,0.9))`,
            }}
          />
          {secondaryProducts[0] ? (
            <div className="absolute left-4 top-8 w-[36%] rotate-[-8deg] small:left-10">
              <Thumbnail
                thumbnail={secondaryProducts[0].thumbnail}
                images={secondaryProducts[0].images}
                size="full"
                isFeatured
                className="bg-white p-0 shadow-none"
                style={{
                  borderRadius: Math.max(theme.panelRadius - 10, 18),
                  border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
                  boxShadow: `0 18px 40px ${toRgba(theme.primaryColor, 0.12)}`,
                }}
              />
            </div>
          ) : null}
          <div className="absolute left-1/2 top-8 w-[44%] -translate-x-1/2 rotate-[4deg] small:top-4">
            <Thumbnail
              thumbnail={primaryProduct.thumbnail}
              images={primaryProduct.images}
              size="full"
              isFeatured
              className="bg-white p-0 shadow-none"
              style={{
                borderRadius: theme.panelRadius,
                border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
                boxShadow: `0 30px 70px ${toRgba(theme.primaryColor, 0.14)}`,
              }}
            />
          </div>
          {secondaryProducts[1] ? (
            <div className="absolute bottom-6 right-4 w-[28%] rotate-[12deg] small:right-10">
              <Thumbnail
                thumbnail={secondaryProducts[1].thumbnail}
                images={secondaryProducts[1].images}
                size="full"
                isFeatured
                className="bg-white p-0 shadow-none"
                style={{
                  borderRadius: Math.max(theme.panelRadius - 12, 16),
                  border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
                  boxShadow: `0 18px 34px ${toRgba(theme.primaryColor, 0.1)}`,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
