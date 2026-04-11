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
  const isSymmetry = theme.themePresetKey === "symmetry"
  const isDawn = theme.themePresetKey === "dawn"
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

  if (isDawn) {
    return (
      <section
        className="content-container border-t py-14 small:py-18"
        style={{ borderColor: "var(--pi-border)" }}
      >
        <div className="mb-8 grid gap-3 border-b pb-7">
          <h2
            className="text-[2rem] leading-[1.06] text-[var(--pi-text)] small:text-[2.4rem]"
            style={{ fontFamily: "var(--pi-heading-font)" }}
          >
            Featured collection
          </h2>
          <p className="max-w-[38rem] text-sm text-[var(--pi-muted)] small:text-base">
            {collection.title}
          </p>
          <LocalizedClientLink
            href="/store"
            className="theme-outline-button !mt-1 !w-fit !rounded-none"
          >
            {messages.common.browseAllProducts}
          </LocalizedClientLink>
        </div>

        <ul
          className="grid grid-cols-2 gap-x-6 gap-y-10 small:grid-cols-3"
          data-testid="featured-products-list"
        >
          {pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (isSymmetry) {
    return (
      <section className="content-container border-t py-14 small:py-20" style={{ borderColor: "var(--pi-border)" }}>
        <div className="mb-8 grid gap-4 rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-scheme-2-bg)] px-6 py-8 text-[var(--pi-scheme-2-text)] small:grid-cols-[minmax(0,1fr)_auto] small:items-end">
          <div className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-white/70">
              Boutique feature
            </span>
            <h2
              className="text-[2rem] leading-[1.02] small:text-[2.5rem]"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              Color-blocked featured collection
            </h2>
            <p className="max-w-[36rem] text-sm leading-6 text-white/78 small:text-base">
              {collection.title}
            </p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="theme-outline-button !w-fit !rounded-[999px] !border-white/40 !bg-transparent !text-white hover:!bg-white hover:!text-[var(--pi-scheme-2-bg)]"
          >
            {messages.common.browseAllProducts}
          </LocalizedClientLink>
        </div>

        <ul className="grid gap-6 small:grid-cols-2 xl:grid-cols-4" data-testid="featured-products-list">
          {pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
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
