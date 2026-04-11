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
  const isWoodmart = theme.themePresetKey === "woodmart"
  const isDawn = theme.themePresetKey === "dawn"
  const heroImage = normalizeImageUrl(
    primaryProduct?.thumbnail || primaryProduct?.images?.[0]?.url
  )

  if (isWoodmart) {
    return (
      <section className="border-y border-[var(--pi-border)] bg-[var(--pi-bg)]">
        <div className="content-container grid gap-6 py-8 small:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] small:py-10">
          <div className="grid gap-5 rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6">
            <span className="inline-flex w-fit rounded-[4px] border border-[var(--pi-border-strong)] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
              {theme.heroEyebrow}
            </span>
            <h1
              className="max-w-[12ch] text-[clamp(2.3rem,5vw,4.5rem)] leading-[0.95] text-[var(--pi-text)]"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              {theme.heroHeading}
            </h1>
            <p className="max-w-[34rem] text-sm leading-6 text-[var(--pi-muted)] small:text-base">
              {theme.heroSubheading}
            </p>
            <div className="flex flex-wrap gap-3">
              <ActionLink
                href={primaryHref}
                className="theme-solid-button !rounded-[4px] !border-[var(--pi-primary)] !bg-[var(--pi-primary)] !text-[#1a1713]"
              >
                {collection
                  ? t(messages.home.shopCollection, { name: collection.title })
                  : theme.ctaLabel}
              </ActionLink>
              <ActionLink
                href={secondaryHref}
                className="theme-outline-button !rounded-[4px] !border-[var(--pi-border-strong)] !text-[var(--pi-text)]"
              >
                {secondaryLabel}
              </ActionLink>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={primaryProduct?.title ?? theme.brandName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={shouldUnoptimizeImage(heroImage)}
                className="object-cover object-center opacity-85"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(26,23,19,0.08),rgba(26,23,19,0.56))]" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-[4px] border border-[var(--pi-border)] bg-[rgba(26,23,19,0.72)] px-4 py-3 backdrop-blur-sm">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                  Lookbook
                </span>
                <p className="mt-2 text-sm text-[var(--pi-text)]">
                  Curated scene styling with warm materials and tactile product detail.
                </p>
              </div>
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
