import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import EmpireQuickAdd from "./empire-quick-add"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  layout = "default",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  layout?: "default" | "list"
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
  const isEmpire = theme.themePresetKey === "warehouse"
  const defaultVariant = product.variants?.[0]
  const canQuickAdd = Boolean(
    defaultVariant?.id &&
      (product.variants?.length || 0) === 1 &&
      (!defaultVariant.manage_inventory ||
        defaultVariant.allow_backorder ||
        (defaultVariant.inventory_quantity || 0) > 0)
  )

  if (isEmpire) {
    if (layout === "list") {
      return (
        <div className="grid gap-4 small:grid-cols-[130px_minmax(0,1fr)_auto] small:items-center">
          <LocalizedClientLink href={`/products/${product.handle}`}>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              alt={product.title ?? ""}
              size="square"
              className="bg-[var(--pi-surface)] p-0 shadow-none"
              style={{
                border: "1px solid var(--pi-border)",
                borderRadius: 4,
              }}
            />
          </LocalizedClientLink>
          <div className="grid gap-1.5">
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="text-base font-medium text-[var(--pi-text)]"
              data-testid="product-title"
            >
              {product.title}
            </LocalizedClientLink>
            <span className="text-xs text-[var(--pi-muted)]">
              ★★★★☆ (124)
            </span>
            <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          <EmpireQuickAdd
            variantId={defaultVariant?.id || null}
            canQuickAdd={canQuickAdd}
          />
        </div>
      )
    }

    return (
      <div data-testid="product-wrapper" className="grid gap-3">
        <LocalizedClientLink href={`/products/${product.handle}`} className="group">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            alt={product.title ?? ""}
            size="full"
            isFeatured={isFeatured}
            className="bg-[var(--pi-surface)] p-0 shadow-none transition-opacity duration-150 group-hover:opacity-90"
            style={{
              border: "1px solid var(--pi-border)",
              borderRadius: 4,
              boxShadow: "none",
            }}
          />
        </LocalizedClientLink>
        <div className="grid gap-1.5">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="text-sm font-medium leading-6 text-[var(--pi-text)]"
            data-testid="product-title"
          >
            {product.title}
          </LocalizedClientLink>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--pi-muted)]">★★★★☆ (124)</span>
            <EmpireQuickAdd
              variantId={defaultVariant?.id || null}
              canQuickAdd={canQuickAdd}
            />
          </div>
          <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
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
