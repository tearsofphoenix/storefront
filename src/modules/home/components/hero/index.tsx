import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
  toRgba,
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
        limit: 3,
        fields: "*variants.calculated_price,+metadata,+tags",
      },
    })

    products = heroProducts
  }

  const primaryProduct = products[0]
  const supportingProducts = products.slice(1, 3)
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
      className="relative overflow-hidden border-b"
      style={{
        borderColor: toRgba(theme.primaryColor, 0.12),
        background: `linear-gradient(180deg, ${theme.navBackground} 0%, ${theme.shellBackground} 42%, #ffffff 100%)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-20"
        style={{
          background: `linear-gradient(180deg, ${toRgba(
            theme.accentColor,
            0.28
          )} 0%, transparent 100%)`,
        }}
      />
      <div className="content-container relative z-10 grid gap-12 py-12 small:grid-cols-[1.05fr_0.95fr] small:items-center small:py-20">
        <div className="relative order-2 small:order-1">
          <div
            className="theme-section-panel relative min-h-[340px] overflow-hidden p-6 small:min-h-[520px] small:p-10"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, ${theme.navBackground} 100%)`,
              borderColor: toRgba(theme.primaryColor, 0.12),
            }}
          >
            <div
              className="absolute inset-x-10 top-8 h-24 rounded-full blur-3xl"
              style={{
                background: `linear-gradient(135deg, ${toRgba(
                  theme.primaryColor,
                  0.18
                )}, ${toRgba(theme.accentColor, 0.3)})`,
              }}
            />
            {supportingProducts[0] ? (
              <div className="absolute left-2 top-20 w-[34%] rotate-[-10deg] small:left-8">
                <Thumbnail
                  thumbnail={supportingProducts[0].thumbnail}
                  images={supportingProducts[0].images}
                  size="full"
                  isFeatured
                  className="bg-white p-0 shadow-none"
                  style={{
                    borderRadius: Math.max(theme.panelRadius - 8, 18),
                    border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
                    boxShadow: `0 24px 50px ${toRgba(
                      theme.primaryColor,
                      0.12
                    )}`,
                  }}
                />
              </div>
            ) : null}
            <div className="relative mx-auto mt-12 w-[54%] max-w-[360px] rotate-[6deg] small:mt-10">
              <Thumbnail
                thumbnail={primaryProduct?.thumbnail}
                images={primaryProduct?.images}
                size="full"
                isFeatured
                className="bg-white p-0 shadow-none"
                style={{
                  borderRadius: theme.panelRadius,
                  border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
                  boxShadow: `0 30px 70px ${toRgba(theme.primaryColor, 0.16)}`,
                }}
              />
            </div>
            {supportingProducts[1] ? (
              <div className="absolute bottom-10 right-2 w-[30%] rotate-[11deg] small:right-10">
                <Thumbnail
                  thumbnail={supportingProducts[1].thumbnail}
                  images={supportingProducts[1].images}
                  size="full"
                  isFeatured
                  className="bg-white p-0 shadow-none"
                  style={{
                    borderRadius: Math.max(theme.panelRadius - 10, 16),
                    border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
                    boxShadow: `0 20px 44px ${toRgba(
                      theme.primaryColor,
                      0.12
                    )}`,
                  }}
                />
              </div>
            ) : null}
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 small:bottom-8 small:left-8">
              {(heroHighlights.length > 0
                ? heroHighlights
                : theme.heroMetrics.map((metric) => metric.value)
              )
                .slice(0, 3)
                .map((highlight) => (
                  <span
                    key={highlight}
                    className="theme-eyebrow"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      color: "#111827",
                    }}
                  >
                    {highlight}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="order-1 grid gap-6 small:order-2">
          <div className="theme-eyebrow" style={{ color: theme.primaryColor }}>
            {theme.heroEyebrow}
          </div>
          <div className="grid gap-4">
            <h1
              className="text-4xl leading-[1] small:text-6xl"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
              }}
            >
              {theme.heroHeading}
            </h1>
            <div className="grid gap-2">
              <p
                className="text-xl leading-tight small:text-[2rem]"
                style={{
                  color: "#111827",
                  fontFamily: theme.headingFontFamily,
                }}
              >
                {collection ? collection.title : theme.brandName}
              </p>
              <p
                className="max-w-[34rem] text-base leading-7 small:text-lg"
                style={{
                  color: "#4b5563",
                  fontFamily: theme.bodyFontFamily,
                }}
              >
                {theme.heroSubheading}
              </p>
            </div>
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
                borderColor: toRgba(theme.primaryColor, 0.18),
              }}
            >
              {secondaryLabel}
            </ActionLink>
          </div>

          <div className="grid gap-3 small:max-w-[34rem]">
            {(heroHighlights.length > 0
              ? heroHighlights
              : theme.heroMetrics.map(
                  (metric) => `${metric.label}: ${metric.value}`
                )
            )
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-full px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.66)",
                    border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
                    color: "#374151",
                  }}
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 rounded-full"
                    style={{ background: theme.primaryColor }}
                  />
                  <span style={{ fontFamily: theme.bodyFontFamily }}>
                    {item}
                  </span>
                </div>
              ))}
          </div>

          <div
            className="grid gap-3 rounded-[28px] p-5 small:max-w-[34rem] small:grid-cols-3"
            style={{
              background: "rgba(255,255,255,0.76)",
              border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
            }}
          >
            {theme.heroMetrics.slice(0, 3).map((metric) => (
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
                    fontFamily: theme.headingFontFamily,
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
