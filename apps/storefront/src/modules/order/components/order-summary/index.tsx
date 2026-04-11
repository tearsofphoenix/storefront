"use client"

import { convertToLocale } from "@lib/util/money"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const { messages } = useI18n()

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="rm-panel-soft p-5">
      <h2 className="text-base-semi">{messages.order.orderSummary}</h2>
      <div className="my-2 text-small-regular text-ui-fg-base">
        <div className="mb-2 flex items-center justify-between text-base-regular text-ui-fg-base">
          <span>{messages.common.subtotal}</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{messages.common.discount}</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{messages.common.discount}</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>{messages.common.shipping}</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{messages.common.taxes}</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="my-4 h-px w-full border-b border-[var(--pi-border)]" />
        <div className="mb-2 flex items-center justify-between text-base-regular text-ui-fg-base">
          <span>{messages.common.total}</span>
          <span className="font-semibold">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
