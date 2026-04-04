import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getI18n } from "@lib/i18n/server"
import {
  getStorefrontThemePresentation,
  toRgba,
} from "@lib/util/theme-manifest"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const localeLabel = currentLocale?.toUpperCase() ?? "GLOBAL"

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {theme.announcement ? (
        <div
          className="border-b px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em]"
          style={{
            background: "#f7f7fa",
            borderColor: "#d9dfe8",
            color: "#6b7280",
          }}
        >
          {theme.announcement}
        </div>
      ) : null}
      <header
        className="relative mx-auto border-b bg-white"
        style={{
          borderColor: "#d9dfe8",
          background: theme.navBackground,
        }}
      >
        <nav
          className="content-container flex min-h-[64px] items-center justify-between gap-4 text-sm"
          style={{
            color: "#6b7280",
            fontFamily: theme.bodyFontFamily,
          }}
        >
          <div className="flex flex-1 basis-0 items-center gap-3">
            <div className="flex h-full items-center shrink-0">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                brandName={theme.brandName}
                primaryColor={theme.primaryColor}
                navBackground={theme.navBackground}
                headingFontFamily={theme.headingFontFamily}
                bodyFontFamily={theme.bodyFontFamily}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="truncate text-sm font-semibold uppercase tracking-[0.14em] text-grey-90"
              style={{
                color: "#111827",
                fontFamily: theme.headingFontFamily,
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>
          </div>

          <div className="hidden items-center gap-x-6 small:flex">
            <LocalizedClientLink
              className="transition-colors hover:text-grey-90"
              href="/store"
              style={{ color: "#4b5563" }}
            >
              {messages.common.store}
            </LocalizedClientLink>
            <LocalizedClientLink
              className="transition-colors hover:text-grey-90"
              href="/account"
              data-testid="nav-account-link"
              style={{ color: "#4b5563" }}
            >
              {messages.common.account}
            </LocalizedClientLink>
          </div>

          <div className="flex flex-1 basis-0 items-center justify-end gap-x-3">
            <div
              className="hidden items-center rounded-md border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] small:inline-flex"
              style={{
                borderColor: "#d9dfe8",
                background: "#ffffff",
                color: "#6b7280",
              }}
            >
              {localeLabel}
            </div>
            <div className="small:hidden">
              <LocalizedClientLink
                className="inline-flex items-center rounded-md border border-[#d9dfe8] bg-white px-3 py-2 text-[13px] font-medium text-grey-70"
                href="/account"
              >
                {messages.common.account}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="inline-flex items-center rounded-md border px-3 py-2 text-[13px] font-medium"
                  href="/cart"
                  data-testid="nav-cart-link"
                  style={{
                    color: "#111827",
                    borderColor: "#d9dfe8",
                    background: "#ffffff",
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
