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
import ThemeSwitcher from "@modules/layout/components/theme-switcher"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isPorto = theme.themePresetKey === "porto"
  const isDawn = theme.themePresetKey === "dawn"

  if (isPorto) {
    return (
      <div className="sticky inset-x-0 top-0 z-50 border-b border-[var(--pi-border)] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[var(--pi-border)] bg-[var(--pi-surface-soft)]">
          <div
            className="content-container flex min-h-9 flex-wrap items-center justify-between gap-3 py-2 text-[11px] uppercase tracking-[0.12em]"
            style={{ color: "var(--pi-muted-soft)", fontFamily: "var(--pi-body-font)" }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{theme.announcement || "Porto demo · trade pricing ready"}</span>
              <span>Fast dispatch</span>
              <span>Corporate ordering</span>
            </div>
            <div className="hidden items-center gap-x-4 small:flex">
              <span>Support desk</span>
              <span>Global regions</span>
            </div>
          </div>
        </div>
        <header className="relative mx-auto bg-[var(--pi-nav-bg)]">
          <nav
            className="content-container grid min-h-[88px] gap-4 py-4 small:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] small:items-center"
            style={{ color: "var(--pi-muted)", fontFamily: "var(--pi-body-font)" }}
          >
            <div className="flex items-center gap-3 small:gap-4">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                brandName={theme.brandName}
                primaryColor={theme.primaryColor}
                navBackground="var(--pi-nav-bg)"
              />
              <div className="grid gap-0.5">
                <LocalizedClientLink
                  href="/"
                  className="truncate text-base font-semibold uppercase tracking-[0.12em]"
                  style={{
                    color: "var(--pi-text)",
                    fontFamily: "var(--pi-heading-font)",
                  }}
                  data-testid="nav-store-link"
                >
                  {theme.brandName}
                </LocalizedClientLink>
                <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                  Enterprise catalog
                </span>
              </div>
            </div>

            <div className="hidden items-center justify-center gap-x-6 small:flex">
              <LocalizedClientLink
                className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                href="/store"
                style={{ color: "var(--pi-text)" }}
              >
                {messages.common.store}
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                href="/customer-service"
                style={{ color: "var(--pi-muted)" }}
              >
                Customer service
              </LocalizedClientLink>
              <LocalizedClientLink
                className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                href="/account"
                data-testid="nav-account-link"
                style={{ color: "var(--pi-muted)" }}
              >
                {messages.common.account}
              </LocalizedClientLink>
            </div>

            <div className="flex items-center justify-end gap-x-2 small:gap-x-3">
              <div className="hidden rounded-[2px] border border-[var(--pi-border)] bg-white px-2 small:flex">
                <DawnSearch placeholder="Search catalog" />
              </div>
              <ThemeSwitcher className="hidden small:flex" />
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="inline-flex items-center rounded-[2px] border border-[var(--pi-border)] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em]"
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
              <ThemeSwitcher className="hidden small:flex" />
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
            <ThemeSwitcher className="hidden small:flex" />
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
