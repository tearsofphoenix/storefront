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
  const isPorto = theme.themePresetKey === "porto"
  const isDawn = theme.themePresetKey === "dawn"
  const heroImage = normalizeImageUrl(
    primaryProduct?.thumbnail || primaryProduct?.images?.[0]?.url
  )

  if (isPorto) {
    const secondaryProducts = products.slice(1, 3)

    return (
      <section className="border-y border-[var(--pi-border)] bg-[linear-gradient(180deg,#ffffff,#f7fafc)]">
        <div className="content-container grid gap-6 py-10 small:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)] small:items-start small:py-14">
          <div className="grid gap-5 rounded-[2px] border border-[var(--pi-border)] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] small:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-[2px] bg-[var(--pi-primary)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
                {theme.heroEyebrow}
              </span>
              <span className="inline-flex rounded-[2px] border border-[var(--pi-border)] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Multi-demo market
              </span>
            </div>
            <div className="grid gap-4">
              <h1
                className="max-w-[11ch] text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.92] text-[var(--pi-text)]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {theme.heroHeading}
              </h1>
              <p className="max-w-[40rem] text-base leading-7 text-[var(--pi-muted)] small:text-lg">
                {theme.heroSubheading}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionLink
                href={primaryHref}
                className="theme-solid-button !rounded-[2px] !border-[var(--pi-primary)] !bg-[var(--pi-primary)] !px-6"
              >
                {collection
                  ? t(messages.home.shopCollection, { name: collection.title })
                  : theme.ctaLabel}
              </ActionLink>
              <ActionLink
                href={secondaryHref}
                className="theme-outline-button !rounded-[2px] !border-[var(--pi-border-strong)] !bg-white"
              >
                {secondaryLabel}
              </ActionLink>
            </div>

            <div className="grid gap-3 border-t border-[var(--pi-border)] pt-5 small:grid-cols-2">
              {(theme.heroMetrics.length > 0
                ? theme.heroMetrics
                : heroHighlights.map((value) => ({
                    label: messages.home.featuredLabel,
                    value,
                  }))
              )
                .slice(0, 4)
                .map((metric) => (
                  <div
                    key={`${metric.label}-${metric.value}`}
                    className="rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)] px-4 py-3"
                  >
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                      {metric.label}
                    </span>
                    <p className="mt-1 text-base font-semibold text-[var(--pi-text)]">
                      {metric.value}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={primaryProduct?.title ?? theme.brandName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  unoptimized={shouldUnoptimizeImage(heroImage)}
                  className="object-cover object-center"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(15,23,42,0.42))]" />
              <div className="relative grid min-h-[28rem] content-between p-5">
                <div className="flex justify-between gap-3">
                  <span className="inline-flex rounded-[2px] bg-white/92 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#0f172a]">
                    Fast filters
                  </span>
                  <span className="inline-flex rounded-[2px] border border-white/30 bg-black/18 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
                    B2B ready
                  </span>
                </div>
                <div className="rounded-[2px] border border-white/20 bg-[rgba(15,23,42,0.68)] p-4 text-white backdrop-blur-sm">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-white/70">
                    Featured catalog
                  </span>
                  <p className="mt-2 text-xl" style={{ fontFamily: "var(--pi-heading-font)" }}>
                    {primaryProduct?.title ?? theme.brandName}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Dense merchandising surfaces for fashion, electronics, corporate gifting, and multi-region sales teams.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 small:grid-cols-2">
              {secondaryProducts.map((product) => {
                const thumbnail = normalizeImageUrl(
                  product.thumbnail || product.images?.[0]?.url
                )

                return (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="grid gap-3 rounded-[2px] border border-[var(--pi-border)] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={product.title ?? ""}
                            fill
                            sizes="64px"
                            unoptimized={shouldUnoptimizeImage(thumbnail)}
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="grid gap-1">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                          Quick market
                        </span>
                        <p className="line-clamp-2 text-sm font-semibold text-[var(--pi-text)]">
                          {product.title}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-primary)]">
                      View detail
                    </span>
                  </LocalizedClientLink>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isDawn) {
    return (
      <section className="relative isolate min-h-[72dvh] overflow-hidden border-y border-[var(--pi-border)]">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={primaryProduct?.title ?? theme.brandName}
              fill
              priority
              sizes="100vw"
              unoptimized={shouldUnoptimizeImage(heroImage)}
              className="object-cover object-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/34" />
        </div>
        <div className="content-container relative z-[1] grid min-h-[72dvh] items-end py-14 small:items-center small:py-20">
          <div className="grid max-w-[39rem] gap-5">
            <span className="inline-flex w-fit border border-white/35 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
              {theme.heroEyebrow}
            </span>
            <h1
              className="max-w-[12ch] text-[clamp(2.3rem,5.8vw,4.6rem)] leading-[0.98] text-white"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              {theme.heroHeading}
            </h1>
            <p className="max-w-[34rem] text-base leading-7 text-white/90 small:text-lg">
              {theme.heroSubheading}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <ActionLink
                href={primaryHref}
                className="theme-solid-button !rounded-none !border-[#121212] !bg-[#121212] !px-6"
              >
                {collection
                  ? t(messages.home.shopCollection, { name: collection.title })
                  : theme.ctaLabel}
              </ActionLink>
              <ActionLink
                href={secondaryHref}
                className="theme-outline-button !rounded-none !border-white !bg-transparent !text-white hover:!bg-white hover:!text-[#121212]"
              >
                {secondaryLabel}
              </ActionLink>
            </div>
          </div>
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
