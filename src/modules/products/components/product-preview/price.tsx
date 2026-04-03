import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted text-sm"
          style={{ color: "#9ca3af" }}
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted text-sm", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        style={{ color: price.price_type === "sale" ? "#111827" : "#4b5563" }}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
