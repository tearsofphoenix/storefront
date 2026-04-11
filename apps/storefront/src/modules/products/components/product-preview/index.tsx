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
  const isPorto = theme.themePresetKey === "porto"
  const isDawn = theme.themePresetKey === "dawn"

  if (isPorto) {
    const inventoryTotal = (product.variants ?? []).reduce(
      (total, variant) => total + Math.max(variant.inventory_quantity ?? 0, 0),
      0
    )
    const inStock = (product.variants ?? []).some((variant) => {
      if (!variant.manage_inventory || variant.allow_backorder) {
        return true
      }

      return (variant.inventory_quantity ?? 0) > 0
    })
    const inventoryLabel = inStock
      ? inventoryTotal > 0 && inventoryTotal < 8
        ? `Only ${inventoryTotal} left`
        : "In stock"
      : "Back soon"

    return (
      <LocalizedClientLink href={`/products/${product.handle}`} className="group">
        <div className="grid gap-3 rounded-[2px] border border-[var(--pi-border)] bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="relative overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
            <div className="absolute left-3 top-3 z-[1] flex flex-wrap gap-2">
              <span className="inline-flex rounded-[2px] bg-[var(--pi-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                {inventoryLabel}
              </span>
              <span className="inline-flex rounded-[2px] border border-[var(--pi-border)] bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--pi-text)]">
                Cutoff 18:00
              </span>
            </div>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              alt={product.title ?? ""}
              size="full"
              isFeatured={isFeatured}
              className="bg-[var(--pi-surface)] p-0 shadow-none transition-transform duration-200 group-hover:scale-[1.02]"
              style={{
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="grid gap-1">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                  {product.collection?.title ?? "Porto catalog"}
                </span>
                <Text
                  className="text-sm font-semibold leading-6"
                  data-testid="product-title"
                  style={{
                    color: "var(--pi-text)",
                    fontFamily: "var(--pi-heading-font)",
                  }}
                >
                  {product.title}
                </Text>
              </div>
              <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
                {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--pi-border)] pt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--pi-muted-soft)]">
              <span>{(product.variants ?? []).length} variants</span>
              <span>{inStock ? "Fast dispatch" : "Notify me"}</span>
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  if (isDawn) {
    return (
      <div className="group grid gap-3">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="relative block overflow-hidden border border-[var(--pi-border)] bg-[var(--pi-surface)]"
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            alt={product.title ?? ""}
            size="full"
            isFeatured={isFeatured}
            className="bg-[var(--pi-surface)] p-0 shadow-none transition-opacity duration-150 group-hover:opacity-90"
            style={{
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
            }}
          />
          <span className="absolute bottom-0 left-0 right-0 inline-flex h-10 items-center justify-center bg-black/75 text-[11px] font-semibold uppercase tracking-[0.15em] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            View product
          </span>
        </LocalizedClientLink>
        <div className="grid gap-1.5">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="text-sm font-medium leading-6 text-[var(--pi-text)]"
            data-testid="product-title"
          >
            {product.title}
          </LocalizedClientLink>
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
