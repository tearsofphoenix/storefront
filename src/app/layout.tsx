import { getLocaleMessages, getCurrentLocale } from "@lib/i18n/server"
import { I18nProvider } from "@lib/i18n/provider"
import { getBaseURL } from "@lib/util/env"
import { getSeoToolkitSiteName } from "@lib/util/plugin-manifest"
import { Metadata } from "next"
import { Poppins, Quicksand } from "next/font/google"
import "styles/globals.css"

const siteName = getSeoToolkitSiteName()
const headingFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-heading",
})
const bodyFont = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
})

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

  return (
    <html
      lang={locale}
      data-mode="light"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body className="bg-[#f4f2ed] text-grey-90 antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <main className="relative min-h-screen">{props.children}</main>
        </I18nProvider>
      </body>
    </html>
  )
}
