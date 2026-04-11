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
  const isEmpire = theme.themePresetKey === "warehouse"

  if (isEmpire) {
    return (
      <section className="border-y border-[var(--pi-border)] bg-[var(--pi-bg)]">
        <div className="content-container grid gap-5 py-8 small:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] small:py-10">
          <div className="grid gap-5 rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-5 small:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div className="grid gap-4">
              <span className="theme-eyebrow !rounded-[4px] !bg-white !px-3 !py-1 !text-[10px] !tracking-[0.12em]">
                Popular departments
              </span>
              <h1
                className="max-w-[13ch] text-[clamp(2rem,4.8vw,3.8rem)] leading-[0.98]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {theme.heroHeading}
              </h1>
              <p className="max-w-[30rem] text-sm leading-6 text-[var(--pi-muted)] small:text-base">
                {theme.heroSubheading}
              </p>
              <div className="flex flex-wrap gap-3">
                <ActionLink
                  href={primaryHref}
                  className="theme-solid-button !rounded-[20px] !border-[#ffd814] !bg-[#ffd814] !text-[#0f1111]"
                >
                  {collection
                    ? t(messages.home.shopCollection, { name: collection.title })
                    : theme.ctaLabel}
                </ActionLink>
                <ActionLink
                  href={secondaryHref}
                  className="theme-outline-button !rounded-[20px] !border-[var(--pi-border-strong)]"
                >
                  {secondaryLabel}
                </ActionLink>
              </div>
            </div>
            <div>
              <Thumbnail
                thumbnail={primaryProduct?.thumbnail}
                images={primaryProduct?.images}
                alt={primaryProduct?.title ?? ""}
                size="full"
                isFeatured
                className="h-full bg-[var(--pi-surface)] p-0"
                style={{
                  border: "1px solid var(--pi-border)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          <aside className="grid gap-3 rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
              Quick access
            </span>
            <div className="grid gap-2">
              {products.slice(0, 5).map((product) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="flex items-center justify-between rounded-[4px] border border-[var(--pi-border)] bg-[#fff] px-3 py-2 text-sm text-[var(--pi-text)] transition-colors hover:border-[var(--pi-border-strong)]"
                >
                  <span className="truncate">{product.title}</span>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--pi-muted)]">
                    View
                  </span>
                </LocalizedClientLink>
              ))}
            </div>
          </aside>
        </div>
      </section>
    )
  }

  return (
    <section
      className="border-y"
      style={{
        background: "var(--pi-bg)",
        borderColor: "var(--pi-border)",
      }}
    >
      <div className="content-container grid gap-12 py-16 small:grid-cols-[0.95fr_1.05fr] small:items-center small:py-24">
        <div className="order-2 small:order-1">
          <div
            className="theme-section-panel overflow-hidden"
            style={{
              borderRadius: 0,
              borderColor: "var(--pi-border)",
              background: "var(--pi-surface-soft)",
            }}
          >
            <div
              className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "var(--pi-muted-soft)" }}
            >
              {collection ? collection.title : theme.brandName}
            </div>
            <div className="p-5 small:p-8">
              <Thumbnail
                thumbnail={primaryProduct?.thumbnail}
                images={primaryProduct?.images}
                alt={primaryProduct?.title ?? ""}
                size="full"
                isFeatured
                className="bg-[var(--pi-surface)] p-0 shadow-none"
                style={{
                  borderRadius: 0,
                  border: "1px solid var(--pi-border)",
                  boxShadow: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div className="order-1 grid gap-6 small:order-2">
          <div className="theme-eyebrow">
            {theme.heroEyebrow}
          </div>
          <div className="grid gap-4">
            <h1
              className="max-w-[12ch] text-4xl leading-[1.05] small:text-6xl"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {theme.heroHeading}
            </h1>
            <p
              className="max-w-[34rem] text-base leading-7 text-grey-60 small:text-lg"
              style={{
                color: "var(--pi-muted)",
                fontFamily: "var(--pi-body-font)",
              }}
            >
              {theme.heroSubheading}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionLink href={primaryHref} className="theme-solid-button">
              {collection
                ? t(messages.home.shopCollection, { name: collection.title })
                : theme.ctaLabel}
            </ActionLink>
            <ActionLink
              href={secondaryHref}
              className="theme-outline-button"
              style={{
                borderColor: "var(--pi-border-strong)",
                background: "var(--pi-surface)",
              }}
            >
              {secondaryLabel}
            </ActionLink>
          </div>

          <div
            className="grid gap-3 border p-5 small:max-w-[34rem] small:grid-cols-3"
            style={{
              borderColor: "var(--pi-border)",
              background: "var(--pi-surface)",
              boxShadow: "none",
            }}
          >
            {(heroHighlights.length > 0
              ? heroHighlights.map((value) => ({
                  label: messages.home.featuredLabel,
                  value,
                }))
              : theme.heroMetrics
            )
              .slice(0, 3)
              .map((metric) => (
              <div key={metric.label} className="grid gap-1">
                <span
                  className="text-[0.72rem] uppercase tracking-[0.16em]"
                  style={{ color: "var(--pi-muted-soft)" }}
                >
                  {metric.label}
                </span>
                <span
                  className="text-base"
                  style={{
                    color: "var(--pi-text)",
                    fontFamily: "var(--pi-body-font)",
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
