import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import {
  getStorefrontThemePresentation,
  toRgba,
} from "@lib/util/theme-manifest"
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

  const theme = getStorefrontThemePresentation()
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const cardSurface =
    theme.cardStyle === "outline"
      ? "rgba(255,255,255,0.84)"
      : theme.cardStyle === "minimal"
      ? "transparent"
      : "rgba(255,255,255,0.9)"

  const cardBorder =
    theme.cardStyle === "minimal"
      ? "transparent"
      : toRgba(theme.primaryColor, theme.cardStyle === "outline" ? 0.16 : 0.1)

  const cardShadow = `0 20px 44px ${toRgba(theme.primaryColor, 0.08)}`

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        style={{
          borderRadius: theme.panelRadius,
          padding: 18,
          background: cardSurface,
          border: `1px solid ${cardBorder}`,
          boxShadow: cardShadow,
          transition: "transform 180ms ease, box-shadow 180ms ease",
        }}
        className="group-hover:-translate-y-1"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          className="bg-white p-0 shadow-none"
          style={{
            background: `linear-gradient(180deg, #ffffff 0%, ${theme.navBackground} 100%)`,
            border: `1px solid ${toRgba(theme.primaryColor, 0.08)}`,
            borderRadius: theme.panelRadius,
            boxShadow: "none",
          }}
        />
        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between gap-4">
            <Text
              className="text-ui-fg-subtle text-base"
              data-testid="product-title"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
              }}
            >
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2 whitespace-nowrap">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          <span
            className="text-sm"
            style={{
              color: "#6b7280",
              fontFamily: theme.bodyFontFamily,
            }}
          >
            Explore product
          </span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
