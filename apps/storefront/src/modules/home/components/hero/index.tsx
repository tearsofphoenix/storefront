import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import type { CSSProperties, ReactNode } from "react"

type HeroProps = {
  collection: HttpTypes.StoreCollection | null
  region: HttpTypes.StoreRegion
}

type ActionLinkProps = {
  href: string
  className: string
  children: ReactNode
  style?: CSSProperties
}

const ActionLink = ({ href, className, children, style }: ActionLinkProps) => {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    )
  }

  return (
    <LocalizedClientLink href={href} className={className} style={style}>
      {children}
    </LocalizedClientLink>
  )
}

export default async function Hero({ collection, region }: HeroProps) {
  const theme = getStorefrontThemePresentation()
  const { messages, t } = await getI18n()
  let products: HttpTypes.StoreProduct[] = []

  if (collection) {
    const {
      response: { products: heroProducts },
    } = await listProducts({
      regionId: region.id,
      queryParams: {
        collection_id: collection.id,
        limit: 4,
        fields: "*variants.calculated_price,+metadata,+tags",
      },
    })

    products = heroProducts
  }

  const primaryProduct = products[0]
  const heroHighlights =
    theme.heroFeatureBullets.length > 0
      ? theme.heroFeatureBullets.slice(0, 3)
      : products.slice(0, 3).map((product) => product.title)
  const primaryHref = collection
    ? `/collections/${collection.handle}`
    : theme.ctaHref
  const secondaryHref = theme.secondaryCtaHref || "/store"
  const secondaryLabel = theme.secondaryCtaLabel || messages.home.browseCatalog

  return (
    <section
      className="bg-[#f3ede2]"
      style={{
        borderColor: "transparent",
      }}
    >
      <div className="content-container grid gap-10 py-12 small:grid-cols-[0.95fr_1.05fr] small:items-center small:py-16">
        <div className="order-2 small:order-1">
          <div
            className="theme-section-panel overflow-hidden"
            style={{
              borderRadius: 0,
              borderColor: "transparent",
              background: "#efe7d8",
            }}
          >
            <div className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50">
              {collection ? collection.title : theme.brandName}
            </div>
            <div className="p-5 small:p-8">
              <Thumbnail
                thumbnail={primaryProduct?.thumbnail}
                images={primaryProduct?.images}
                size="full"
                isFeatured
                className="bg-[#f7f7fa] p-0 shadow-none"
                style={{
                  borderRadius: 0,
                  border: "none",
                  boxShadow: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div className="order-1 grid gap-5 small:order-2">
          <div className="theme-eyebrow">
            {theme.heroEyebrow}
          </div>
          <div className="grid gap-3">
            <h1
              className="max-w-[12ch] text-4xl leading-none text-grey-90 small:text-6xl"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
              }}
            >
              {theme.heroHeading}
            </h1>
            <p
              className="max-w-[34rem] text-base leading-7 text-grey-60 small:text-lg"
              style={{
                color: "#4b5563",
                fontFamily: theme.bodyFontFamily,
              }}
            >
              {theme.heroSubheading}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionLink
              href={primaryHref}
              className="theme-solid-button"
              style={{
                background: theme.buttonFillColor,
                color: theme.buttonTextColor,
              }}
            >
              {collection
                ? t(messages.home.shopCollection, { name: collection.title })
                : theme.ctaLabel}
            </ActionLink>
            <ActionLink
              href={secondaryHref}
              className="theme-outline-button"
              style={{
                borderColor: "transparent",
                background: "#e9e0d0",
              }}
            >
              {secondaryLabel}
            </ActionLink>
          </div>

          <div
            className="grid gap-3 bg-[#efe7d8] p-5 small:max-w-[34rem] small:grid-cols-3"
            style={{
              boxShadow: "none",
            }}
          >
            {(heroHighlights.length > 0
              ? heroHighlights.map((value) => ({
                  label: "Featured",
                  value,
                }))
              : theme.heroMetrics
            )
              .slice(0, 3)
              .map((metric) => (
              <div key={metric.label} className="grid gap-1">
                <span
                  className="text-[0.72rem] uppercase tracking-[0.16em]"
                  style={{ color: "#6b7280" }}
                >
                  {metric.label}
                </span>
                <span
                  className="text-base"
                  style={{
                    color: "#111827",
                    fontFamily: theme.bodyFontFamily,
                  }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
