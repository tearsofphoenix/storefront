import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
} from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import ImpulseAnnouncementBar from "@modules/layout/components/impulse-announcement-bar"
import ImpulseMegaMenu from "@modules/layout/components/impulse-mega-menu"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
    listCategories({ limit: 24 }),
  ])
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isImpulse = theme.themePresetKey === "impulse"
  const megaMenuCategories = categories
    .filter((category) => !category.parent_category)
    .slice(0, 4)
    .map((category) => ({
      id: category.id,
      name: category.name,
      handle: category.handle,
      children:
        category.category_children?.map((child) => ({
          id: child.id,
          name: child.name,
          handle: child.handle,
        })) ?? [],
    }))

  if (isImpulse) {
    return (
      <div className="sticky inset-x-0 top-0 z-50">
        <ImpulseAnnouncementBar
          message={theme.announcement || "Flash sale · Extra 15% for members"}
        />
        <header
          className="relative mx-auto border-b"
          style={{
            borderColor: "var(--pi-border)",
            background: "var(--pi-nav-bg)",
            boxShadow: "0 6px 22px rgba(28, 28, 28, 0.08)",
          }}
        >
          <nav
            className="content-container flex min-h-[78px] items-center justify-between gap-4 text-sm"
            style={{
              color: "var(--pi-muted)",
              fontFamily: "var(--pi-body-font)",
            }}
          >
            <div className="flex flex-1 basis-0 items-center gap-4">
              <div className="flex h-full items-center shrink-0 small:hidden">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                  brandName={theme.brandName}
                  primaryColor={theme.primaryColor}
                  navBackground="var(--pi-nav-bg)"
                />
              </div>
              <ImpulseMegaMenu
                categories={megaMenuCategories}
                storeLabel={messages.common.store}
                accountLabel={messages.common.account}
              />
            </div>

            <LocalizedClientLink
              href="/"
              className="truncate text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{
                color: "var(--pi-text)",
                fontFamily: "var(--pi-heading-font)",
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>

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
