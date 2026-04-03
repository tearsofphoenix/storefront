import { HttpTypes } from "@medusajs/types"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontPluginById,
  readStorefrontPluginManifest,
} from "@lib/util/plugin-manifest"
import {
  getStorefrontThemePresentation,
  toRgba,
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
    <section
      className="rounded-[32px] border px-6 py-8 small:px-10"
      style={{
        background: `linear-gradient(180deg, ${theme.navBackground} 0%, #ffffff 100%)`,
        borderColor: toRgba(theme.primaryColor, 0.1),
        boxShadow: `0 20px 44px ${toRgba(theme.primaryColor, 0.08)}`,
      }}
    >
      <div className="grid gap-3">
        <span className="theme-eyebrow" style={{ color: theme.primaryColor }}>
          {plugin.name ?? "Reviews"}
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
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
              color: "#374151",
            }}
          >
            {t(messages.product.pluginSlug, { slug: plugin.slug })}
          </span>
          <span
            className="rounded-full px-4 py-2 text-sm"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: `1px solid ${toRgba(theme.primaryColor, 0.1)}`,
              color: "#374151",
            }}
          >
            {t(messages.product.storefrontModules, { count: reviewerCount })}
          </span>
        </div>
      </div>
    </section>
  )
}

export default ProductReviewsPlugin
