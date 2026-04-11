import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isImpulse = theme.themePresetKey === "impulse"
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  if (isImpulse) {
    return (
      <section
        className="content-container border-t py-14 small:py-18"
        style={{ borderColor: "var(--pi-border)" }}
      >
        <div className="mb-8 grid gap-4 border-b pb-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <h2
                className="text-[2rem] font-semibold leading-[1.04] small:text-[2.5rem]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                Trending now
              </h2>
              <p className="text-sm small:text-base">{collection.title}</p>
            </div>
            <LocalizedClientLink
              href="/store"
              className="theme-solid-button !rounded-[2px] !border-[#e8283a] !bg-[#e8283a]"
            >
              {messages.common.browseAllProducts}
            </LocalizedClientLink>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-[2px] border border-[#f4a9b1] bg-[#ffe9ec] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#be2233]">
              New arrivals
            </span>
            <span className="rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted)]">
              Best sellers
            </span>
            <span className="rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted)]">
              Editors&apos; picks
            </span>
          </div>
        </div>

        <ul
          className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-4"
          data-testid="featured-products-list"
        >
          {pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>

        <div className="mt-12 overflow-hidden border-y border-[var(--pi-border)] py-3">
          <div className="impulse-logo-track flex min-w-max items-center gap-10 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pi-muted)]">
            {["PANDA", "NOVA", "KINETIC", "STUDIO", "PRIME", "AVENUE", "SUNDAY", "PIVOT"].map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="content-container border-t py-14 small:py-20" style={{ borderColor: "var(--pi-border)" }}>
      <div className="mb-8 flex items-end justify-between gap-6 pb-8">
        <div className="grid gap-1">
          <h2
            className="text-[1.9rem] font-semibold small:text-[2.3rem]"
            style={{ fontFamily: "var(--pi-heading-font)" }}
          >
            Featured
          </h2>
          <p
            className="text-sm small:text-base"
            style={{ fontFamily: "var(--pi-body-font)" }}
          >
            {collection.title}
          </p>
        </div>
        <LocalizedClientLink
          href="/store"
          className="hidden items-center gap-2 border-b border-transparent text-[12px] font-medium uppercase tracking-[0.12em] transition-colors small:inline-flex"
          style={{ color: "var(--pi-muted)" }}
        >
          {messages.common.browseAllProducts}
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-7 gap-y-12 small:grid-cols-4" data-testid="featured-products-list">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </section>
  )
}
