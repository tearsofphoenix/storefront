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
      className="w-full border-t bg-white"
      style={{ borderColor: "#d9dfe8" }}
    >
      <div className="content-container flex flex-col w-full">
        <div className="grid gap-10 py-14 small:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="grid gap-6">
            <LocalizedClientLink
              href="/"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-grey-90"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
              }}
            >
              {theme.brandName}
            </LocalizedClientLink>
            <Text
              className="text-base-regular"
              style={{
                maxWidth: 420,
                color: "#4b5563",
                fontFamily: theme.bodyFontFamily,
              }}
            >
              {theme.footerNote ||
                messages.footer.fallbackNote}
            </Text>
            <MedusaCTA />
          </div>
          <div className="grid gap-8 text-small-regular small:col-span-3 small:grid-cols-3">
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50"
                style={{ fontFamily: theme.headingFontFamily }}
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
                        className="text-sm text-grey-60 transition-colors hover:text-grey-90"
                        href={`/categories/${category.handle}`}
                        data-testid="category-link"
                      >
                        {category.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {messages.common.collections}
              </span>
              <ul className="grid grid-cols-1 gap-2">
                {collections?.slice(0, 5).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      className="text-sm text-grey-60 transition-colors hover:text-grey-90"
                      href={`/collections/${collection.handle}`}
                    >
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-3">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50"
                style={{ fontFamily: theme.headingFontFamily }}
              >
                {messages.common.storefront}
              </span>
              <ul className="grid grid-cols-1 gap-2 text-sm text-grey-60">
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="transition-colors hover:text-grey-90"
                  >
                    {messages.common.allProducts}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/cart"
                    className="transition-colors hover:text-grey-90"
                  >
                    {messages.common.cart}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/privacy-policy"
                    className="transition-colors hover:text-grey-90"
                  >
                    {messages.account.privacyPolicy}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/content/terms-of-use"
                    className="transition-colors hover:text-grey-90"
                  >
                    {messages.account.termsOfUse}
                  </LocalizedClientLink>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-grey-90"
                  >
                    {messages.common.documentation}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="flex w-full flex-col gap-4 border-t py-4 text-ui-fg-muted small:flex-row small:items-center small:justify-between"
          style={{ borderColor: "#e5e7eb" }}
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
          <div className="flex items-center gap-4 text-sm text-grey-60">
            <a
              href="https://github.com/medusajs"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-grey-90"
            >
              GitHub
            </a>
            <a
              href="https://github.com/medusajs/nextjs-starter-medusa"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-grey-90"
            >
              {messages.common.sourceCode}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
