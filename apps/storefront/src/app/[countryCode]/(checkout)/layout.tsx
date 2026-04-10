import { getI18n } from "@lib/i18n/server"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export const dynamic = "force-dynamic"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()

  return (
    <div className="relative w-full bg-[var(--rm-bg)] small:min-h-screen">
      <div className="border-b border-[var(--rm-border)] bg-[var(--rm-surface)]">
        <nav className="content-container flex min-h-[64px] items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-70"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block text-grey-60 transition-colors hover:text-grey-90">
              {messages.common.backToShoppingCart}
            </span>
            <span className="mt-px block text-grey-60 transition-colors hover:text-grey-90 small:hidden">
              {messages.common.back}
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.14em] text-grey-90"
            data-testid="store-link"
            style={{ fontFamily: theme.headingFontFamily }}
          >
            {theme.brandName}
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
