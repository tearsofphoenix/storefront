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
          className="text-sm line-through text-grey-40"
          style={{ color: "#9ca3af" }}
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-sm font-semibold", {
          "text-grey-90": price.price_type === "sale",
          "text-grey-70": price.price_type !== "sale",
        })}
        style={{ color: price.price_type === "sale" ? "#111827" : "#4b5563" }}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
