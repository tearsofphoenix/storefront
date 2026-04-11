import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import DawnSearch from "@modules/layout/components/dawn-search"
import SideMenu from "@modules/layout/components/side-menu"
import TurboSearch from "@modules/layout/components/turbo-search"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
    listCategories({ limit: 10 }),
  ])
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isFlatsome = theme.themePresetKey === "flatsome"
  const isDawn = theme.themePresetKey === "dawn"

  if (isFlatsome) {
    const featuredProducts = regions?.[0]?.id
      ? await listProducts({
          regionId: regions[0].id,
          queryParams: { limit: 6, fields: "*variants.calculated_price" },
        }).then(({ response }) => response.products)
      : []
    const suggestions = [
      ...featuredProducts.map((product) => ({
        label: product.title,
        href: `/products/${product.handle}`,
        type: "product" as const,
      })),
      ...categories
        .filter((category) => !category.parent_category)
        .slice(0, 5)
        .map((category) => ({
          label: category.name,
          href: `/categories/${category.handle}`,
          type: "category" as const,
        })),
    ]

    return (
      <div className="sticky inset-x-0 top-0 z-50">
        <div className="border-b border-[var(--pi-border)] bg-[var(--pi-surface)]">
          <div className="content-container flex min-h-9 items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
            <span>USD / Global Support</span>
            <span>Customer care +1 (800) 555-0199</span>
          </div>
        </div>
        <header
          className="relative mx-auto border-b bg-[var(--pi-nav-bg)] backdrop-blur-md"
          style={{ borderColor: "var(--pi-border)" }}
        >
          <nav className="content-container flex min-h-[78px] items-center justify-between gap-4 text-sm">
            <div className="flex flex-1 basis-0 items-center gap-4">
              <div className="small:hidden">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                  brandName={theme.brandName}
                  primaryColor={theme.primaryColor}
                  navBackground="var(--pi-nav-bg)"
                />
              </div>
              <div className="hidden items-center gap-x-7 small:flex">
                <LocalizedClientLink
                  className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--pi-text)]"
                  href="/store"
                >
                  {messages.common.store}
                </LocalizedClientLink>
                <LocalizedClientLink
                  className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--pi-text)]"
                  href="/account"
                  data-testid="nav-account-link"
                >
                  {messages.common.account}
                </LocalizedClientLink>
              </div>
            </div>

            <LocalizedClientLink
              href="/"
              className="truncate text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>

            <div className="flex flex-1 basis-0 items-center justify-end gap-x-4">
              <div className="hidden w-full max-w-[360px] small:block">
                <TurboSearch suggestions={suggestions} />
              </div>
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="inline-flex items-center border-b border-transparent px-0 py-2 text-[12px] font-medium uppercase tracking-[0.12em]"
                    href="/cart"
                    data-testid="nav-cart-link"
                    style={{ color: "var(--pi-text)" }}
                  >
                    {messages.common.cart} (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
          <div className="border-t border-[var(--pi-border)] bg-[var(--pi-surface)] small:hidden">
            <div className="content-container py-3">
              <TurboSearch suggestions={suggestions} />
            </div>
          </div>
        </header>
      </div>
    )
  }

  if (isDawn) {
    return (
      <div className="sticky inset-x-0 top-0 z-50">
        {theme.announcement ? (
          <div
            className="border-b px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em]"
            style={{
              background: "var(--pi-surface)",
              borderColor: "var(--pi-border)",
              color: "var(--pi-muted-soft)",
            }}
          >
            {theme.announcement}
          </div>
        ) : null}
        <header
          className="relative mx-auto border-b bg-[var(--pi-nav-bg)]"
          style={{
            borderColor: "var(--pi-border)",
          }}
        >
          <nav
            className="content-container grid min-h-[74px] grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm"
            style={{
              color: "var(--pi-muted)",
              fontFamily: "var(--pi-body-font)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="small:hidden">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                  brandName={theme.brandName}
                  primaryColor={theme.primaryColor}
                  navBackground="var(--pi-nav-bg)"
                />
              </div>
              <div className="hidden items-center gap-x-7 small:flex">
                <LocalizedClientLink
                  className="text-[12px] uppercase tracking-[0.12em]"
                  href="/store"
                  style={{ color: "var(--pi-text)" }}
                >
                  {messages.common.store}
                </LocalizedClientLink>
                <LocalizedClientLink
                  className="text-[12px] uppercase tracking-[0.12em]"
                  href="/account"
                  data-testid="nav-account-link"
                  style={{ color: "var(--pi-text)" }}
                >
                  {messages.common.account}
                </LocalizedClientLink>
              </div>
            </div>

            <LocalizedClientLink
              href="/"
              className="justify-self-center text-[12px] font-semibold uppercase tracking-[0.2em]"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>

            <div className="flex items-center justify-end gap-1 small:gap-3">
              <DawnSearch />
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="inline-flex items-center border-b border-transparent px-0 py-2 text-[12px] uppercase tracking-[0.12em]"
                    href="/cart"
                    data-testid="nav-cart-link"
                    style={{
                      color: "var(--pi-text)",
                    }}
                  >
                    {messages.common.cart} (0)
                  </LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>
          </nav>
        </header>
      </div>
    )
  }

  return (
    <div className="sticky inset-x-0 top-0 z-50">
      {theme.announcement ? (
        <div
          className="border-b px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em]"
          style={{
            background: "var(--pi-surface)",
            borderColor: "var(--pi-border)",
            color: "var(--pi-muted-soft)",
          }}
        >
          {theme.announcement}
        </div>
      ) : null}
      <header
        className="relative mx-auto border-b backdrop-blur-md"
        style={{
          borderColor: "var(--pi-border)",
          background: "var(--pi-nav-bg)",
        }}
      >
        <nav
          className="content-container flex min-h-[74px] items-center justify-between gap-4 text-sm"
          style={{
            color: "var(--pi-muted)",
            fontFamily: "var(--pi-body-font)",
          }}
        >
          <div className="flex flex-1 basis-0 items-center gap-4">
            <div className="flex h-full items-center shrink-0">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                brandName={theme.brandName}
                primaryColor={theme.primaryColor}
                navBackground="var(--pi-nav-bg)"
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-grey-90"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>
          </div>

          <div className="hidden items-center gap-x-8 small:flex">
            <LocalizedClientLink
              className="text-[12px] font-medium uppercase tracking-[0.14em] transition-colors"
              href="/store"
              style={{ color: "var(--pi-muted)" }}
            >
              {messages.common.store}
            </LocalizedClientLink>
            <LocalizedClientLink
              className="text-[12px] font-medium uppercase tracking-[0.14em] transition-colors"
              href="/account"
              data-testid="nav-account-link"
              style={{ color: "var(--pi-muted)" }}
            >
              {messages.common.account}
            </LocalizedClientLink>
          </div>

          <div className="flex flex-1 basis-0 items-center justify-end gap-x-4">
            <div className="small:hidden">
              <LocalizedClientLink
                className="inline-flex items-center border-b border-transparent px-0 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors"
                href="/account"
                style={{ color: "var(--pi-muted)" }}
              >
                {messages.common.account}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="inline-flex items-center border-b border-transparent px-0 py-2 text-[12px] font-medium uppercase tracking-[0.12em]"
                  href="/cart"
                  data-testid="nav-cart-link"
                  style={{
                    color: "var(--pi-text)",
                  }}
                >
                  {messages.common.cart} (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
