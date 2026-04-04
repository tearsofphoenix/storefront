import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const theme = getStorefrontThemePresentation()

  return (
    <div id="product-info">
      <div className="mx-auto flex max-w-[560px] flex-col gap-y-4">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50 transition-colors hover:text-grey-70"
            style={{ color: "#6b7280", fontFamily: theme.headingFontFamily }}
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-tight text-ui-fg-base small:text-4xl"
          data-testid="product-title"
          style={{ fontFamily: theme.headingFontFamily, color: "#111827" }}
        >
          {product.title}
        </Heading>

        <Text
          className="whitespace-pre-line text-base leading-7 text-grey-60"
          data-testid="product-description"
          style={{
            color: theme.headingStyle === "serif" ? "#3f3f46" : "#4b5563",
            fontFamily: theme.bodyFontFamily,
          }}
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
