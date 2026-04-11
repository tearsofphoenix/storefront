import { Suspense } from "react"

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

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isDawn = theme.themePresetKey === "dawn"

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
