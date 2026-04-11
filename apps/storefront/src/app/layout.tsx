import { getLocaleMessages, getCurrentLocale } from "@lib/i18n/server"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import {
  resolveStorefrontThemePresetKey,
  STOREFRONT_THEME_COOKIE_KEY,
} from "@lib/util/theme-presets"
import { I18nProvider } from "@lib/i18n/provider"
import { getBaseURL } from "@lib/util/env"
import { getSeoToolkitSiteName } from "@lib/util/plugin-manifest"
import { Metadata } from "next"
import { cookies } from "next/headers"
import "styles/globals.css"

const siteName = getSeoToolkitSiteName()

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getCurrentLocale()
  const messages = getLocaleMessages(locale)
  const manifestTheme = getStorefrontThemePresentation().themePresetKey
  const cookieStore = await cookies()
  const themeFromCookie = cookieStore.get(STOREFRONT_THEME_COOKIE_KEY)?.value
  const activeThemeKey = resolveStorefrontThemePresetKey(
    themeFromCookie || manifestTheme
  )

  return (
    <html lang={locale} data-mode="light" data-theme={activeThemeKey}>
      <body className="antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <main className="relative min-h-screen">{props.children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
