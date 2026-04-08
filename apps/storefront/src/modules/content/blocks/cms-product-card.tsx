import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

type CmsProductCardProps = {
  product: HttpTypes.StoreProduct
  badge?: string | null
  description?: string | null
  ctaLabel?: string | null
  highlight?: string | null
  variant?: "shelf" | "bundle"
}

export const CmsProductCard = ({
  badge,
  ctaLabel,
  description,
  highlight,
  product,
  variant = "shelf",
}: CmsProductCardProps) => {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  const isBundle = variant === "bundle"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <article
        className={`overflow-hidden rounded-[1.75rem] bg-[#f8f3ea] transition-transform duration-200 group-hover:-translate-y-1 ${
          isBundle ? "lg:group-hover:-translate-y-1.5" : ""
        }`}
      >
        <div className="p-4">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            className="border-none bg-[#ebe2d2] p-0 shadow-none"
            style={{
              background: "#ebe2d2",
              borderRadius: 20,
            }}
          />
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {badge ? (
              <span className="rounded-full bg-[#111827] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                {badge}
              </span>
            ) : null}
            {highlight ? (
              <span className="rounded-full bg-[#efe6d7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111827]">
                {highlight}
              </span>
            ) : null}
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-7 text-[#111827]">
              {product.title}
            </h3>
            {description ? (
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#4b5563]">
                {description}
              </p>
            ) : null}
          </div>
          {cheapestPrice ? (
            <div className="flex items-end gap-2">
              {cheapestPrice.price_type === "sale" ? (
                <span className="text-sm text-[#9ca3af] line-through">
                  {cheapestPrice.original_price}
                </span>
              ) : null}
              <span className="text-base font-semibold text-[#111827]">
                {cheapestPrice.calculated_price}
              </span>
            </div>
          ) : null}
          {isBundle ? (
            <span className="inline-flex w-fit items-center rounded-full bg-[#111827] px-4 py-2 text-sm font-medium text-white transition-opacity group-hover:opacity-85">
              {ctaLabel || "Explore bundle"}
            </span>
          ) : null}
        </div>
      </article>
    </LocalizedClientLink>
  )
}
