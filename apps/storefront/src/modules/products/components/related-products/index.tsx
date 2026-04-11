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
  const isEmpire = theme.themePresetKey === "warehouse"
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
          isEmpire
            ? "mb-8 flex flex-col gap-2 text-left"
            : "mb-16 flex flex-col items-center text-center"
        }
      >
        <span className="text-base-regular text-gray-600 mb-6">
          {isEmpire
            ? "Frequently bought together"
            : messages.product.relatedProductsHeading}
        </span>
        <p
          className={
            isEmpire
              ? "max-w-2xl text-[2rem] leading-[1.06]"
              : "text-2xl-regular text-ui-fg-base max-w-lg"
          }
          style={isEmpire ? { fontFamily: "var(--pi-heading-font)" } : undefined}
        >
          {isEmpire
            ? "Complete your order with these high-conversion companion products."
            : messages.product.relatedProductsDescription}
        </p>
      </div>

      <ul
        className={
          isEmpire
            ? "grid grid-cols-2 gap-x-4 gap-y-6 rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4 small:grid-cols-4"
            : "grid grid-cols-2 gap-x-6 gap-y-8 small:grid-cols-3 medium:grid-cols-4"
        }
      >
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
