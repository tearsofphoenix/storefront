import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const theme = getStorefrontThemePresentation()
  const isPorto = theme.themePresetKey === "porto"

  if (isPorto) {
    return (
      <div
        id="product-info"
        className="rounded-[2px] border border-[var(--pi-border)] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
      >
        <div className="mx-auto flex max-w-[560px] flex-col gap-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.collection ? (
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="rounded-[2px] bg-[var(--pi-surface-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-primary)]"
              >
                {product.collection.title}
              </LocalizedClientLink>
            ) : null}
            {product.type?.value ? (
              <span className="rounded-[2px] border border-[var(--pi-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                {product.type.value}
              </span>
            ) : null}
          </div>
          <Heading
            level="h2"
            className="text-[2.4rem] leading-[0.94] text-[var(--pi-text)] small:text-[3.1rem]"
            data-testid="product-title"
            style={{ fontFamily: "var(--pi-heading-font)" }}
          >
            {product.title}
          </Heading>
          <Text
            className="whitespace-pre-line text-base leading-7 text-[var(--pi-muted)]"
            data-testid="product-description"
            style={{ fontFamily: "var(--pi-body-font)" }}
          >
            {product.description}
          </Text>
          <div className="grid gap-3 border-t border-[var(--pi-border)] pt-4 small:grid-cols-3">
            <div className="grid gap-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Material
              </span>
              <span className="text-sm text-[var(--pi-text)]">{product.material || "-"}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Variants
              </span>
              <span className="text-sm text-[var(--pi-text)]">{(product.variants ?? []).length}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Origin
              </span>
              <span className="text-sm text-[var(--pi-text)]">{product.origin_country || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          className="text-3xl leading-tight text-ui-fg-base small:text-4xl"
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
