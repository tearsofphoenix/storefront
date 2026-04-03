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
  const isSerif = theme.headingStyle === "serif"

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {theme.announcement ? (
        <div
          className="border-b px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em]"
          style={{
            background: "#ffffff",
            borderColor: toRgba(theme.primaryColor, 0.08),
            color: "#4b5563",
          }}
        >
          {theme.announcement}
        </div>
      ) : null}
      <header
        className="relative mx-auto border-b duration-200"
        style={{
          background: theme.navBackground,
          borderColor: toRgba(theme.primaryColor, 0.16),
          backdropFilter:
            theme.surfaceStyle === "glass" ? "blur(14px)" : undefined,
          boxShadow: `0 16px 34px ${toRgba(theme.primaryColor, 0.06)}`,
        }}
      >
        <nav
          className="content-container flex min-h-[76px] items-center justify-between gap-4 text-small-regular"
          style={{
            color: isSerif ? "#3f3f46" : undefined,
            fontFamily: theme.bodyFontFamily,
          }}
        >
          <div className="flex flex-1 basis-0 items-center">
            <div className="flex h-full items-center">
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
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden h-9 w-9 items-center justify-center rounded-full border small:flex"
              style={{
                borderColor: toRgba(theme.primaryColor, 0.14),
                background: "rgba(255,255,255,0.72)",
                color: theme.primaryColor,
                fontFamily: theme.headingFontFamily,
                fontSize: "0.78rem",
              }}
            >
              {theme.brandName.slice(0, 1)}
            </div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              style={{
                color: "#111827",
                letterSpacing: isSerif ? "0.06em" : "0.12em",
                fontFamily: theme.headingFontFamily,
              }}
              data-testid="nav-store-link"
            >
              {theme.brandName}
            </LocalizedClientLink>
          </div>

          <div className="flex flex-1 basis-0 items-center justify-end gap-x-6">
            <div className="hidden items-center gap-x-6 small:flex">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/store"
                style={{ color: "#4b5563" }}
              >
                {messages.common.store}
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
                style={{ color: "#4b5563" }}
              >
                {messages.common.account}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2 rounded-full border px-4 py-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                  style={{
                    color: "#111827",
                    borderColor: toRgba(theme.primaryColor, 0.16),
                    background: "rgba(255,255,255,0.72)",
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
