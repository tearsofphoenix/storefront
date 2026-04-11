import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const theme = getStorefrontThemePresentation()
  const isPrestige = theme.themePresetKey === "prestige"

  return (
    <div id="product-info">
      <div className="mx-auto flex max-w-[560px] flex-col gap-y-4">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50 transition-colors hover:text-grey-70"
            style={{
              color: "var(--pi-muted-soft)",
              fontFamily: "var(--pi-heading-font)",
            }}
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className={
            isPrestige
              ? "text-[2.35rem] leading-[1.06] text-ui-fg-base small:text-[3rem]"
              : "text-3xl leading-tight text-ui-fg-base small:text-4xl"
          }
          data-testid="product-title"
          style={{ fontFamily: "var(--pi-heading-font)", color: "var(--pi-text)" }}
        >
          {product.title}
        </Heading>

        <Text
          className="whitespace-pre-line text-base leading-7 text-grey-60"
          data-testid="product-description"
          style={{
            color: "var(--pi-muted)",
            fontFamily: "var(--pi-body-font)",
          }}
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
