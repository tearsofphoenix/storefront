import { Heading } from "@medusajs/ui"

import { getI18n } from "@lib/i18n/server"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const { messages } = await getI18n()

  return (
    <aside className="sticky top-0 flex flex-col-reverse gap-y-8 py-8 small:flex-col small:py-0">
      <div className="rm-panel flex w-full flex-col px-6 py-6 small:px-8 small:py-8">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline"
        >
          {messages.common.inYourCart}
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </aside>
  )
}

export default CheckoutSummary
