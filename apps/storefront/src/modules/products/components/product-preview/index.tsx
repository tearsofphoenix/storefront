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
  const isFlatsome = theme.themePresetKey === "flatsome"
  const isDawn = theme.themePresetKey === "dawn"

  if (isFlatsome) {
    return (
      <div className="group grid gap-3">
        <div className="relative overflow-hidden border border-[var(--pi-border)] bg-[var(--pi-surface)]">
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              alt={product.title ?? ""}
              size="full"
              isFeatured={isFeatured}
              className="bg-[var(--pi-surface)] p-0 shadow-none transition duration-200 group-hover:scale-[1.02]"
              style={{
                border: "none",
                borderRadius: 0,
                boxShadow: "none",
              }}
            />
          </LocalizedClientLink>
          <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-full opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="flex h-10 items-center justify-center rounded-[3px] bg-[var(--pi-primary)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Quick view
            </LocalizedClientLink>
          </div>
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
            <div className="flex gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-[#2e6ecf]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#7c3aed]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#ef4444]" />
            </div>
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
