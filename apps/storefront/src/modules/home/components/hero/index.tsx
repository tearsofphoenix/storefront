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
  const heroMediaUrl = normalizeImageUrl(
    primaryProduct?.thumbnail || primaryProduct?.images?.[0]?.url
  )
  const prestigeHotspots = [
    { top: "24%", left: "34%" },
    { top: "58%", left: "68%" },
    { top: "78%", left: "42%" },
  ]
  const isPrestige = theme.themePresetKey === "prestige"

  if (isPrestige) {
    return (
      <section
        className="relative isolate min-h-[100dvh] overflow-hidden border-b"
        style={{ borderColor: "var(--pi-border)" }}
      >
        <div className="absolute inset-0">
          {heroMediaUrl ? (
            <Image
              src={heroMediaUrl}
              alt={primaryProduct?.title ?? theme.brandName}
              fill
              priority
              sizes="100vw"
              unoptimized={shouldUnoptimizeImage(heroMediaUrl)}
              className="object-cover object-center"
            />
          ) : null}
          <div className="absolute inset-0 bg-[#17110d]/45" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.66)_0%,rgba(10,10,10,0.36)_44%,rgba(10,10,10,0.12)_100%)]" />
        </div>
        <div className="content-container relative z-[1] grid min-h-[100dvh] items-end gap-10 pb-12 pt-28 small:grid-cols-[1.1fr_0.9fr] small:items-center small:pb-16 small:pt-36">
          <div className="grid max-w-[44rem] gap-7">
            <span
              className="inline-flex w-fit items-center border border-white/35 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {theme.heroEyebrow}
            </span>
            <h1
              className="max-w-[12ch] text-[clamp(3.15rem,8.8vw,6rem)] leading-[0.95]"
              style={{
                color: "#fff",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {theme.heroHeading}
            </h1>
            <p
              className="max-w-[35rem] text-base leading-7 small:text-lg"
              style={{
                color: "rgba(255,255,255,0.84)",
                fontFamily: "var(--pi-body-font)",
              }}
            >
              {theme.heroSubheading}
            </p>

            <div className="flex flex-wrap gap-3">
              <ActionLink
                href={primaryHref}
                className="theme-solid-button !border-[#c9a96e] !bg-[#c9a96e] !text-[#1a1512] hover:!border-[#dab987] hover:!bg-[#dab987]"
              >
                {collection
                  ? t(messages.home.shopCollection, { name: collection.title })
                  : theme.ctaLabel}
              </ActionLink>
              <ActionLink
                href={secondaryHref}
                className="theme-outline-button !border-white/45 !bg-transparent !text-white hover:!border-white hover:!bg-white/10"
              >
                {secondaryLabel}
              </ActionLink>
            </div>

            <ul className="grid gap-2 small:max-w-[31rem] small:grid-cols-3">
              {(heroHighlights.length > 0
                ? heroHighlights
                : theme.heroMetrics.map((metric) => metric.value)
              )
                .slice(0, 3)
                .map((value) => (
                  <li
                    key={value}
                    className="border border-white/25 bg-black/20 px-4 py-3 text-sm"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {value}
                  </li>
                ))}
            </ul>
          </div>

          <div className="hidden small:block">
            <div className="ml-auto grid max-w-[27rem] gap-5">
              <div className="border border-white/30 bg-black/25 p-5 backdrop-blur-sm">
                <p
                  className="text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                >
                  Shop the look
                </p>
                <ul className="mt-3 grid gap-2">
                  {products.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="inline-flex text-base transition-colors hover:text-[#c9a96e]"
                        style={{
                          color: "rgba(255,255,255,0.94)",
                          fontFamily: "var(--pi-heading-font)",
                        }}
                      >
                        {product.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden border border-white/30 bg-[#2a221d]">
                {heroMediaUrl ? (
                  <Image
                    src={heroMediaUrl}
                    alt={primaryProduct?.title ?? theme.brandName}
                    fill
                    sizes="420px"
                    unoptimized={shouldUnoptimizeImage(heroMediaUrl)}
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/20" />
                {products.slice(0, 3).map((product, index) => {
                  const hotspot = prestigeHotspots[index] || prestigeHotspots[0]

                  return (
                    <LocalizedClientLink
                      key={product.id}
                      href={`/products/${product.handle}`}
                      className="prestige-hotspot group"
                      style={{
                        top: hotspot.top,
                        left: hotspot.left,
                      }}
                    >
                      <span className="sr-only">{product.title}</span>
                      <span className="prestige-hotspot-dot" />
                    </LocalizedClientLink>
                  )
                })}
              </div>
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
