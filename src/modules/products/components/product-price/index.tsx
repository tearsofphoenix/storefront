import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { messages } = useI18n()
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col gap-2 text-ui-fg-base">
      <span
        className={clx("text-3xl font-semibold leading-none", {
          "text-grey-90": selectedPrice.price_type === "sale",
        })}
        style={{ color: "#111827" }}
      >
        {!variant && `${messages.product.from} `}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="text-sm text-grey-50">
            <span className="text-grey-50">
              {messages.product.original}:{" "}
            </span>
            <span
              className="line-through text-grey-60"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-sm font-semibold text-grey-90">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
