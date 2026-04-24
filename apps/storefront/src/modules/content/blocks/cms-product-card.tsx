import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getI18n } from "@lib/i18n/server"
import { getProductPrice } from "@lib/util/get-product-price"
import { sectionStyles } from "./section-styles"

type CmsProductCardProps = {
  product: HttpTypes.StoreProduct
  badge?: string | null
  description?: string | null
  ctaLabel?: string | null
  highlight?: string | null
  variant?: "shelf" | "bundle"
}

export const CmsProductCard = async ({
  badge,
  ctaLabel,
  description,
  highlight,
  product,
  variant = "shelf",
}: CmsProductCardProps) => {
  const { messages } = await getI18n()
  const { cheapestPrice } = getProductPrice({
    product,
  })
  const isBundle = variant === "bundle"

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <article
        className={`overflow-hidden rounded-2xl border border-black/10 bg-white transition-transform duration-200 group-hover:-translate-y-1 ${
          isBundle ? "lg:group-hover:-translate-y-1.5" : ""
        }`}
      >
        <div className="p-4 small:p-5">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            alt={product.title ?? ""}
            size="full"
            className="border-none bg-[#f3f1ec] p-0 shadow-none"
            style={{
              background: "#f3f1ec",
              borderRadius: 14,
            }}
          />
        </div>
        <div className="flex flex-col gap-3 px-5 pb-5 small:px-6 small:pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {badge ? (
              <span className={`rounded-[10px] bg-[#111111] px-3 py-1 ${sectionStyles.label} text-white`}>
                {badge}
              </span>
            ) : null}
            {highlight ? (
              <span className={`rounded-[10px] border border-black/10 bg-[#f7f5f1] px-3 py-1 ${sectionStyles.label} text-[#111111]`}>
                {highlight}
              </span>
            ) : null}
          </div>
          <div>
            <h3 className={sectionStyles.cardTitle}>
              {product.title}
            </h3>
            {description ? (
              <p className={`mt-2 whitespace-pre-line ${sectionStyles.bodySmall}`}>
                {description}
              </p>
            ) : null}
          </div>
          {cheapestPrice ? (
            <div className="flex items-end gap-2">
              {cheapestPrice.price_type === "sale" ? (
                <span className={sectionStyles.caption + " line-through"}>
                  {cheapestPrice.original_price}
                </span>
              ) : null}
              <span className={sectionStyles.subTitle}>
                {cheapestPrice.calculated_price}
              </span>
            </div>
          ) : null}
          {isBundle ? (
            <span className={`${sectionStyles.primaryButton} w-fit`}>
              {ctaLabel || messages.common.exploreBundle}
            </span>
          ) : null}
        </div>
      </article>
    </LocalizedClientLink>
  )
}
