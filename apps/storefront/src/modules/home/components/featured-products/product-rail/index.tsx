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
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="mb-6 flex items-end justify-between gap-6 pb-6">
        <div className="grid gap-1">
          <h2
            className="text-[1.75rem] font-semibold text-grey-80 small:text-[2rem]"
            style={{ fontFamily: theme.headingFontFamily }}
          >
            Featured
          </h2>
          <p
            className="text-sm text-grey-60 small:text-base"
            style={{ fontFamily: theme.bodyFontFamily }}
          >
            {collection.title}
          </p>
        </div>
        <LocalizedClientLink
          href="/store"
          className="hidden items-center gap-2 text-sm font-medium text-grey-60 transition-colors hover:text-grey-90 small:inline-flex"
        >
          {messages.common.browseAllProducts}
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-6 small:grid-cols-4" data-testid="featured-products-list">
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
