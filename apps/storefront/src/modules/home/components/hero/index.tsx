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
  const isSymmetry = theme.themePresetKey === "symmetry"
  const isDawn = theme.themePresetKey === "dawn"
  const heroImage = normalizeImageUrl(
    primaryProduct?.thumbnail || primaryProduct?.images?.[0]?.url
  )

  if (isSymmetry) {
    const symmetryTiles = [
      {
        title: collection?.title ?? "New arrivals",
        label: "Story one",
        href: primaryHref,
        background: "var(--pi-scheme-1-bg)",
        color: "var(--pi-scheme-1-text)",
      },
      {
        title: primaryProduct?.title ?? "Curated boutique edit",
        label: "Story two",
        href: primaryProduct?.handle ? `/products/${primaryProduct.handle}` : "/store",
        background: "var(--pi-scheme-2-bg)",
        color: "var(--pi-scheme-2-text)",
      },
      {
        title: heroHighlights[0] ?? "Layered color stories",
        label: "Story three",
        href: secondaryHref,
        background: "var(--pi-scheme-3-bg)",
        color: "var(--pi-scheme-3-text)",
      },
    ]

    return (
      <section className="border-y border-[var(--pi-border)] bg-[var(--pi-bg)]">
        <div className="content-container grid gap-6 py-10 small:py-14">
          <div className="grid gap-6 rounded-[2px] border border-[var(--pi-border)] bg-white p-6 small:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] small:p-8">
            <div className="grid gap-5">
              <span className="inline-flex w-fit rounded-[999px] bg-[var(--pi-surface-soft)] px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--pi-muted-soft)]">
                {theme.heroEyebrow}
              </span>
              <h1
                className="max-w-[11ch] text-[clamp(2.7rem,5vw,5rem)] leading-[0.96] text-[var(--pi-text)]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {theme.heroHeading}
              </h1>
              <p className="max-w-[40rem] text-base leading-7 text-[var(--pi-muted)] small:text-lg">
                {theme.heroSubheading}
              </p>
              <div className="flex flex-wrap gap-3">
                <ActionLink
                  href={primaryHref}
                  className="theme-solid-button !rounded-[999px] !px-6"
                >
                  {collection
                    ? t(messages.home.shopCollection, { name: collection.title })
                    : theme.ctaLabel}
                </ActionLink>
                <ActionLink
                  href={secondaryHref}
                  className="theme-outline-button !rounded-[999px]"
                  style={{
                    borderColor: "var(--pi-border-strong)",
                    background: "var(--pi-surface)",
                  }}
                >
                  {secondaryLabel}
                </ActionLink>
              </div>
            </div>

            <div className="relative min-h-[22rem] overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={primaryProduct?.title ?? theme.brandName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized={shouldUnoptimizeImage(heroImage)}
                  className="object-cover object-center"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,44,44,0.1),rgba(44,44,44,0.42))]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-[2px] bg-white/88 p-4 backdrop-blur-sm">
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                  Color-scheme merchandising
                </span>
                <p className="mt-2 text-sm leading-6 text-[var(--pi-text)]">
                  Build boutique sections that feel distinct while keeping the storefront cohesive.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 small:grid-cols-3">
            {symmetryTiles.map((tile) => (
              <ActionLink
                key={tile.label}
                href={tile.href}
                className="grid min-h-[13rem] content-between rounded-[2px] border border-[var(--pi-border)] p-5 transition-transform duration-200 hover:-translate-y-1"
                style={{ background: tile.background, color: tile.color }}
              >
                <span className="text-[11px] uppercase tracking-[0.16em] opacity-70">
                  {tile.label}
                </span>
                <div className="grid gap-3">
                  <p
                    className="text-[1.7rem] leading-[1.02]"
                    style={{ fontFamily: "var(--pi-heading-font)" }}
                  >
                    {tile.title}
                  </p>
                  <span className="text-[11px] uppercase tracking-[0.14em]">
                    Explore edit
                  </span>
                </div>
              </ActionLink>
            ))}
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
