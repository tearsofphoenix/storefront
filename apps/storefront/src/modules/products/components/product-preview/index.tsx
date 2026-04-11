import { Text, clx } from "@medusajs/ui"
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
  layout = "default",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  layout?: "default" | "prestige-editorial"
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
  const isPrestige = theme.themePresetKey === "prestige"
  const isPrestigeEditorial = isPrestige && layout === "prestige-editorial"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className={clx("group block", {
        "h-full": isPrestigeEditorial,
      })}
    >
      <div
        data-testid="product-wrapper"
        className={clx("grid gap-4", {
          "h-full gap-5": isPrestigeEditorial,
        })}
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={product.title ?? ""}
          size="full"
          isFeatured={isPrestigeEditorial || isFeatured}
          className={clx(
            "bg-[#f7f7fa] p-0 shadow-none transition duration-200",
            {
              "group-hover:scale-[1.04]": isPrestige,
              "group-hover:opacity-90": !isPrestige,
            }
          )}
          style={{
            background: isPrestige
              ? "var(--pi-surface)"
              : "var(--pi-surface-soft)",
            border: isPrestigeEditorial
              ? "1px solid var(--pi-border-strong)"
              : "1px solid var(--pi-border)",
            borderRadius: 0,
            boxShadow: "none",
          }}
        />
        <div className={clx("grid gap-2", { "gap-2.5": isPrestigeEditorial })}>
          {isPrestigeEditorial && product.collection ? (
            <span
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{
                color: "var(--pi-muted-soft)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {product.collection.title}
            </span>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <Text
              className={clx("font-medium leading-6", {
                "text-sm": !isPrestigeEditorial,
                "text-lg leading-7": isPrestigeEditorial,
              })}
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
