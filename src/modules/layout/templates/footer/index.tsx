import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
  toRgba,
} from "@lib/util/theme-manifest"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isSerif = theme.headingStyle === "serif"
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer
      className="border-t w-full"
      style={{
        borderColor: toRgba(theme.primaryColor, 0.12),
        background: `linear-gradient(180deg, ${theme.shellBackground}, ${theme.footerBackground})`,
      }}
    >
      <div className="content-container flex flex-col w-full">
        <div className="grid gap-10 py-16 small:grid-cols-[1.1fr_0.9fr] small:py-24">
          <div className="grid gap-6">
            <span
              className="theme-eyebrow"
              style={{ color: theme.primaryColor }}
            >
              {messages.footer.eyebrow}
            </span>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
                letterSpacing: isSerif ? "0.06em" : undefined,
              }}
            >
              {theme.brandName}
            </LocalizedClientLink>
            <Text
              className="text-base-regular"
              style={{
                maxWidth: 520,
                color: "#4b5563",
                fontFamily: theme.bodyFontFamily,
              }}
            >
              {theme.footerNote ||
                messages.footer.fallbackNote}
            </Text>
            <div className="flex flex-wrap gap-3">
              <LocalizedClientLink href="/store" className="theme-solid-button">
                {messages.common.exploreCatalog}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                className="theme-outline-button"
              >
                {messages.common.account}
              </LocalizedClientLink>
            </div>
          </div>
          <div className="grid gap-8 text-small-regular sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  <span style={{ fontFamily: theme.headingFontFamily }}>
                    {messages.common.categories}
                  </span>
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return null
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                          style={{ color: "#4b5563" }}
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                    style={{ color: "#6b7280" }}
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  <span style={{ fontFamily: theme.headingFontFamily }}>
                    {messages.common.collections}
                  </span>
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                        style={{ color: "#4b5563" }}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">
                <span style={{ fontFamily: theme.headingFontFamily }}>
                  {messages.common.storefront}
                </span>
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:text-ui-fg-base"
                    style={{ color: "#4b5563" }}
                  >
                    {messages.common.allProducts}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/cart"
                    className="hover:text-ui-fg-base"
                    style={{ color: "#4b5563" }}
                  >
                    {messages.common.cart}
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                    style={{ color: "#4b5563" }}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                    style={{ color: "#4b5563" }}
                  >
                    {messages.common.documentation}
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/medusajs/nextjs-starter-medusa"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ui-fg-base"
                    style={{ color: "#4b5563" }}
                  >
                    {messages.common.sourceCode}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="mb-16 flex w-full flex-col gap-4 border-t pt-6 text-ui-fg-muted small:flex-row small:items-center small:justify-between"
          style={{ borderColor: toRgba(theme.primaryColor, 0.08) }}
        >
          <div className="grid gap-2">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} {theme.brandName}.{" "}
              {messages.common.rightsReserved}
            </Text>
            <Text className="txt-compact-small" style={{ maxWidth: 560 }}>
              {messages.common.builtOnMedusa}
            </Text>
          </div>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
