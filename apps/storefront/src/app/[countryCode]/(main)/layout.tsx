import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import ChatbotWidget from "@modules/layout/components/chatbot-widget"
import { ChatbotProductContextProvider } from "@modules/layout/components/chatbot-widget/context"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export const dynamic = "force-dynamic"

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const theme = getStorefrontThemePresentation()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const { shipping_options } = await listCartOptions()

    shippingOptions = shipping_options
  }

  return (
    <ChatbotProductContextProvider>
      <div
        style={{
          minHeight: "100vh",
          background: theme.shellBackground,
          backgroundImage:
            theme.headingStyle === "serif"
              ? `linear-gradient(180deg, ${theme.shellBackground} 0%, ${theme.navBackground} 55%, ${theme.footerBackground} 100%)`
              : undefined,
          color: "#111827",
        }}
      >
        <Nav />
        {customer && cart && (
          <CartMismatchBanner customer={customer} cart={cart} />
        )}

        {cart && (
          <FreeShippingPriceNudge
            variant="popup"
            cart={cart}
            shippingOptions={shippingOptions}
          />
        )}
        {props.children}
        <Footer />
        <ChatbotWidget />
      </div>
    </ChatbotProductContextProvider>
  )
}
