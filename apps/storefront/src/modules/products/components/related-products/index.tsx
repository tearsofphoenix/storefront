import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getI18n } from "@lib/i18n/server"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isDawn = theme.themePresetKey === "dawn"
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div
        className={
          isDawn
            ? "mb-8 flex flex-col gap-2 text-left"
            : "mb-16 flex flex-col items-center text-center"
        }
      >
        <span className="text-base-regular text-gray-600 mb-6">
          {isDawn ? "Recently viewed" : messages.product.relatedProductsHeading}
        </span>
        <p
          className={
            isDawn
              ? "max-w-2xl text-[1.95rem] leading-[1.08]"
              : "text-2xl-regular text-ui-fg-base max-w-lg"
          }
          style={isDawn ? { fontFamily: "var(--pi-heading-font)" } : undefined}
        >
          {isDawn
            ? "Keep browsing products you recently explored."
            : messages.product.relatedProductsDescription}
        </p>
      </div>

      <ul
        className={
          isDawn
            ? "no-scrollbar flex snap-x gap-6 overflow-x-auto pb-2"
            : "grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        }
      >
        {products.map((product) => (
          <li
            key={product.id}
            className={
              isDawn
                ? "min-w-[min(68vw,280px)] snap-start small:min-w-[280px]"
                : undefined
            }
          >
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
