import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import MotionStory from "../motion-story"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isMotion = theme.themePresetKey === "motion"
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

  if (isMotion) {
    return (
      <section className="border-t border-[var(--pi-border)] bg-[var(--pi-bg)]">
        <div className="content-container grid gap-8 pb-6 pt-14 small:pt-18">
          <div className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Motion stories
            </span>
            <h2
              className="max-w-[14ch] text-[2.3rem] leading-[1.02] text-white small:text-[3rem]"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              Narrative-led commerce blocks
            </h2>
          </div>
        </div>
        <MotionStory
          products={pricedProducts.map((product) => ({
            id: product.id,
            title: product.title,
            handle: product.handle || null,
            image: normalizeImageUrl(
              product.thumbnail || product.images?.[0]?.url
            ),
          }))}
        />
        <div className="content-container pb-16 small:pb-20">
          <LocalizedClientLink
            href="/store"
            className="theme-outline-button !rounded-full !border-white/45 !bg-transparent !text-white hover:!border-white hover:!bg-white hover:!text-black"
          >
            {messages.common.browseAllProducts}
          </LocalizedClientLink>
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
