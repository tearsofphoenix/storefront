import { HttpTypes } from "@medusajs/types"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontPluginById,
  readStorefrontPluginManifest,
} from "@lib/util/plugin-manifest"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"

type ProductReviewsPluginProps = {
  product: HttpTypes.StoreProduct
}

const ProductReviewsPlugin = async ({ product }: ProductReviewsPluginProps) => {
  const { messages, t } = await getI18n()
  const plugin = getStorefrontPluginById("reviews")
  const manifest = readStorefrontPluginManifest()
  const theme = getStorefrontThemePresentation()
  const reviewerCount = Math.max(manifest.runtimeCounts["medusa/storefront"], 1)

  if (!plugin) {
    return null
  }

  return (
    <section className="bg-[#f3ede2] px-6 py-8 small:px-10">
      <div className="grid gap-3">
        <span className="theme-eyebrow">
          {plugin.name ?? messages.product.reviews}
        </span>
        <div className="grid gap-2">
          <h3
            className="text-2xl small:text-3xl"
            style={{
              color: "#111827",
              fontFamily: theme.headingFontFamily,
            }}
          >
            {t(messages.product.reviewsHeading, { name: product.title })}
          </h3>
          <p
            className="max-w-[48rem] text-base leading-7"
            style={{
              color: "#4b5563",
              fontFamily: theme.bodyFontFamily,
            }}
          >
            {messages.product.reviewsDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <span
            className="bg-[#e9e0d0] px-4 py-2 text-sm text-grey-70"
          >
            {t(messages.product.pluginSlug, { slug: plugin.slug })}
          </span>
          <span
            className="bg-[#e9e0d0] px-4 py-2 text-sm text-grey-70"
          >
            {t(messages.product.storefrontModules, { count: reviewerCount })}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProductReviewsPlugin
