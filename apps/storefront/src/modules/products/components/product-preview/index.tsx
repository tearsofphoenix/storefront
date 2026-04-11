import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })
  const theme = getStorefrontThemePresentation()
  const isMotion = theme.themePresetKey === "motion"

  if (isMotion) {
    return (
      <LocalizedClientLink href={`/products/${product.handle}`} className="group">
        <div data-testid="product-wrapper" className="grid gap-4">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            alt={product.title ?? ""}
            size="full"
            isFeatured={isFeatured}
            className="bg-[var(--pi-surface)] p-0 shadow-none transition duration-300 group-hover:scale-[1.02] group-hover:opacity-95"
            style={{
              background: "var(--pi-surface)",
              border: "1px solid var(--pi-border)",
              borderRadius: 24,
              boxShadow: "none",
            }}
          />
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-4">
              <Text
                className="text-sm font-medium leading-6"
                data-testid="product-title"
                style={{
                  color: "var(--pi-text)",
                  fontFamily: "var(--pi-heading-font)",
                }}
              >
                {product.title}
              </Text>
              <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
                {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
              Cinematic product story
            </span>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="grid gap-4">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={product.title ?? ""}
          size="full"
          isFeatured={isFeatured}
          className="bg-[#f7f7fa] p-0 shadow-none transition-opacity duration-200 group-hover:opacity-90"
          style={{
            background: "var(--pi-surface-soft)",
            border: "1px solid var(--pi-border)",
            borderRadius: 0,
            boxShadow: "none",
          }}
        />
        <div className="grid gap-2">
          <div className="flex items-start justify-between gap-4">
            <Text
              className="text-sm font-medium leading-6"
              data-testid="product-title"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
