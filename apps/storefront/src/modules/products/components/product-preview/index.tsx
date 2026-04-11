import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { normalizeImageUrl } from "@lib/util/normalize-image-url"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImpulseProductActions from "./impulse-product-actions"
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
  const isImpulse = theme.themePresetKey === "impulse"
  const defaultVariant = product.variants?.[0]
  const canDirectBuy = Boolean(
    defaultVariant?.id &&
      (product.variants?.length || 0) === 1 &&
      (!defaultVariant.manage_inventory ||
        defaultVariant.allow_backorder ||
        (defaultVariant.inventory_quantity || 0) > 0)
  )
  const impulseImage = normalizeImageUrl(product.thumbnail || product.images?.[0]?.url)

  if (isImpulse) {
    return (
      <div className="group relative grid gap-4">
        <div className="relative overflow-hidden rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface-soft)]">
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              alt={product.title ?? ""}
              size="full"
              isFeatured={isFeatured}
              className="bg-[var(--pi-surface-soft)] p-0 shadow-none transition-transform duration-200 group-hover:scale-[1.04]"
              style={{
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </LocalizedClientLink>
          <ImpulseProductActions
            productHandle={product.handle || ""}
            productTitle={product.title || ""}
            imageUrl={impulseImage}
            priceLabel={cheapestPrice?.calculated_price}
            defaultVariantId={defaultVariant?.id || null}
            canDirectBuy={canDirectBuy}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-start justify-between gap-4">
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="text-sm font-medium leading-6"
              data-testid="product-title"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {product.title}
            </LocalizedClientLink>
            <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
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
