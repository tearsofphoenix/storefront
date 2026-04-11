import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"
import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import Image from "next/image"
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
  const isTurbo = theme.themePresetKey === "turbo"

  if (isTurbo) {
    const heroImage = normalizeImageUrl(
      primaryProduct?.thumbnail || primaryProduct?.images?.[0]?.url
    )

    return (
      <section className="border-y border-[var(--pi-border)] bg-[var(--pi-bg)]">
        <div className="content-container grid gap-6 py-8 small:grid-cols-[minmax(0,1.08fr)_340px] small:py-10">
          <div className="relative overflow-hidden rounded-[6px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={primaryProduct?.title ?? theme.brandName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                unoptimized={shouldUnoptimizeImage(heroImage)}
                className="object-cover object-center"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.82)_0%,rgba(15,23,42,0.36)_52%,rgba(15,23,42,0.1)_100%)]" />
            <div className="relative z-[1] grid min-h-[440px] content-end gap-5 p-6 small:min-h-[520px] small:p-8">
              <span className="inline-flex w-fit rounded-[4px] border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white">
                {theme.heroEyebrow}
              </span>
              <h1
                className="max-w-[12ch] text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.95] text-white"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {theme.heroHeading}
              </h1>
              <p className="max-w-[34rem] text-sm leading-6 text-white/84 small:text-base">
                {theme.heroSubheading}
              </p>
              <div className="flex flex-wrap gap-3">
                <ActionLink
                  href={primaryHref}
                  className="theme-solid-button !rounded-[4px] !border-[var(--pi-primary)] !bg-[var(--pi-primary)]"
                >
                  {collection
                    ? t(messages.home.shopCollection, { name: collection.title })
                    : theme.ctaLabel}
                </ActionLink>
                <ActionLink
                  href={secondaryHref}
                  className="theme-outline-button !rounded-[4px] !border-white/50 !bg-white/10 !text-white hover:!border-white hover:!bg-white hover:!text-[var(--pi-text)]"
                >
                  {secondaryLabel}
                </ActionLink>
              </div>
            </div>
          </div>
          <aside className="grid gap-3">
            {products.slice(0, 3).map((product) => (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className="grid gap-3 rounded-[6px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4 transition-colors hover:border-[var(--pi-primary)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[var(--pi-text)]">
                    {product.title}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-primary)]">
                    City
                  </span>
                </div>
                <span className="text-xs text-[var(--pi-muted)]">
                  Fast browse layout preset with denser merchandising.
                </span>
              </LocalizedClientLink>
            ))}
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
