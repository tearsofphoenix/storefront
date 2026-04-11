import {
  getStorefrontPluginHighlights,
  type StorefrontPluginHighlight,
} from "@lib/util/plugin-manifest"
import { getI18n } from "@lib/i18n/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HighlightAction = ({
  highlight,
}: {
  highlight: StorefrontPluginHighlight
}) => {
  if (!highlight.ctaLabel || !highlight.ctaHref) {
    return null
  }

  if (/^https?:\/\//.test(highlight.ctaHref)) {
    return (
      <a
        href={highlight.ctaHref}
        target="_blank"
        rel="noreferrer"
        className="theme-outline-button"
      >
        {highlight.ctaLabel}
      </a>
    )
  }

  return (
    <LocalizedClientLink href={highlight.ctaHref} className="theme-outline-button">
      {highlight.ctaLabel}
    </LocalizedClientLink>
  )
}

const StorefrontPluginHighlights = async () => {
  const { messages } = await getI18n()
  const highlights = getStorefrontPluginHighlights()

  if (!highlights.length) {
    return null
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <span className="theme-eyebrow">
          {messages.product.pluginExtensions}
        </span>
        <h3
          className="text-2xl small:text-3xl"
          style={{
            color: "var(--pi-text)",
            fontFamily: "var(--pi-heading-font)",
          }}
        >
          {messages.product.activePluginCapabilities}
        </h3>
      </div>
      <div className="grid gap-4 small:grid-cols-2">
        {highlights.map((highlight) => (
          <article
            key={highlight.pluginId}
            className="bg-[var(--pi-surface-soft)] p-6"
          >
            <div className="grid gap-3">
              <span className="theme-eyebrow">
                {highlight.badge}
              </span>
              <div className="grid gap-2">
                <h4
                  className="text-xl"
                  style={{
                    color: "var(--pi-text)",
                    fontFamily: "var(--pi-heading-font)",
                  }}
                >
                  {highlight.title}
                </h4>
                <p
                  className="text-base leading-7"
                  style={{
                    color: "var(--pi-muted)",
                    fontFamily: "var(--pi-body-font)",
                  }}
                >
                  {highlight.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#6b7280]">{highlight.pluginName}</span>
                <HighlightAction highlight={highlight} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StorefrontPluginHighlights
