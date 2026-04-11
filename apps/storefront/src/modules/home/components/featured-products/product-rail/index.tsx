import { listProducts } from "@lib/data/products"
import { getI18n } from "@lib/i18n/server"
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
