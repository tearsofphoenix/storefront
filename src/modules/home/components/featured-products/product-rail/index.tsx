import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
  toRgba,
} from "@lib/util/theme-manifest"
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
  const theme = getStorefrontThemePresentation()
  const { messages } = await getI18n()
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div
      className="content-container py-8 small:py-14"
      style={{
        borderTop: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
      }}
    >
      <div
        className="mb-8 grid gap-4 small:grid-cols-[1fr_auto] small:items-end"
        style={{ gap: 20 }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <span className="theme-eyebrow" style={{ color: theme.primaryColor }}>
            {messages.home.featuredCollection}
          </span>
          <h2
            className="text-3xl leading-tight small:text-4xl"
            style={{
              fontFamily: theme.headingFontFamily,
              color: "#111827",
            }}
          >
            {collection.title}
          </h2>
          <p
            className="max-w-[34rem] text-base leading-7"
            style={{
              color: "#4b5563",
              fontFamily: theme.bodyFontFamily,
            }}
          >
            {messages.home.productRailDescription}
          </p>
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="theme-outline-button"
          style={{ borderColor: toRgba(theme.primaryColor, 0.16) }}
        >
          {messages.common.viewAll}
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-1 gap-6 xsmall:grid-cols-2 small:grid-cols-3">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
