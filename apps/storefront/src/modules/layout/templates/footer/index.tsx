import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer
      className="w-full border-t"
      style={{
        borderColor: "var(--pi-border)",
        background: "var(--pi-footer-bg)",
      }}
    >
      <div className="content-container flex flex-col w-full">
        <div className="grid gap-12 py-16 small:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="grid gap-6">
            <LocalizedClientLink
              href="/"
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
            >
              {theme.brandName}
            </LocalizedClientLink>
            <Text
              className="text-base-regular"
              style={{
                maxWidth: 420,
                color: "var(--pi-muted)",
                fontFamily: "var(--pi-body-font)",
              }}
            >
              {theme.footerNote ||
                messages.footer.fallbackNote}
            </Text>
          </div>
          <div className="grid gap-8 text-small-regular small:col-span-3 small:grid-cols-3">
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {messages.common.categories}
              </span>
              <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                {productCategories
                  ?.filter((category) => !category.parent_category)
                  .slice(0, 5)
                  .map((category) => (
                    <li key={category.id}>
                      <LocalizedClientLink
                        className="text-sm transition-colors"
                        href={`/categories/${category.handle}`}
                        data-testid="category-link"
                        style={{ color: "var(--pi-muted)" }}
                      >
                        {category.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {messages.common.collections}
              </span>
              <ul className="grid grid-cols-1 gap-2">
                {collections?.slice(0, 5).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      className="text-sm transition-colors"
                      href={`/collections/${collection.handle}`}
                      style={{ color: "var(--pi-muted)" }}
                    >
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {messages.common.storefront}
              </span>
              <ul className="grid grid-cols-1 gap-2 text-sm" style={{ color: "var(--pi-muted)" }}>
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="transition-colors"
                  >
                    {messages.common.allProducts}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/cart"
                    className="transition-colors"
                  >
                    {messages.common.cart}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/privacy-policy"
                    className="transition-colors"
                  >
                    {messages.account.privacyPolicy}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/terms-of-use"
                    className="transition-colors"
                  >
                    {messages.account.termsOfUse}
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors"
                  >
                    {messages.common.documentation}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="flex w-full flex-col gap-4 border-t py-5 text-ui-fg-muted small:flex-row small:items-center small:justify-between"
          style={{ borderColor: "var(--pi-border)" }}
        >
          <div className="grid gap-2">
            <Text className="txt-compact-small">
              © {new Date().getFullYear()} {theme.brandName}.{" "}
              {messages.common.rightsReserved}
            </Text>
          </div>
        </div>
      </div>
    </footer>
  )
}
