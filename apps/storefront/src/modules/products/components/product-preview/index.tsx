import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
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
  const isWoodmart = theme.themePresetKey === "woodmart"
  const isDawn = theme.themePresetKey === "dawn"

  if (isWoodmart) {
    const secondaryImage = product.images?.[1]?.url
    const simpleVariant = product.variants?.length === 1 ? product.variants[0] : null

    return (
      <div className="group grid gap-3">
        <div className="relative overflow-hidden rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              alt={product.title ?? ""}
              size="full"
              isFeatured={isFeatured}
              className="bg-[var(--pi-surface)] p-0 shadow-none transition-opacity duration-300 group-hover:opacity-0"
              style={{
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
            {secondaryImage ? (
              <Thumbnail
                thumbnail={secondaryImage}
                images={product.images}
                alt={product.title ?? ""}
                size="full"
                isFeatured={isFeatured}
                className="absolute inset-0 bg-[var(--pi-surface)] p-0 opacity-0 shadow-none transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                }}
              />
            ) : null}
          </LocalizedClientLink>
          {simpleVariant?.id ? (
            <div className="absolute right-3 top-3">
              <WishlistButton variantId={simpleVariant.id} />
            </div>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="text-sm font-medium leading-6 text-[var(--pi-text)]"
            data-testid="product-title"
          >
            {product.title}
          </LocalizedClientLink>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
              Warm tone
            </span>
            <div className="flex items-center gap-x-2 whitespace-nowrap text-right">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
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
