"use client"

import { convertToLocale } from "@lib/util/money"
import { useI18n } from "@lib/i18n/use-i18n"
import {
  getFulfillmentStateLabel,
  getOrderFulfillments,
  getPrimaryFulfillmentLabel,
} from "@lib/util/order-fulfillment"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  const { messages, t } = useI18n()
  const fulfillments = getOrderFulfillments(order)

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        {messages.common.delivery}
      </Heading>
      <div className="grid gap-6 small:grid-cols-3">
        <div
          className="rm-panel-soft flex flex-col p-4"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {messages.order.shippingAddress}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="rm-panel-soft flex flex-col p-4"
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {messages.order.contact}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="rm-panel-soft flex flex-col p-4"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            {messages.common.method}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {(order as any).shipping_methods[0]?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>
      {fulfillments.length > 0 && (
        <div className="mt-8 grid gap-4" data-testid="shipping-fulfillment-summary">
          <Text className="txt-medium-plus text-ui-fg-base">
            {messages.order.fulfillmentTimeline}
          </Text>
          {fulfillments.map((fulfillment) => {
            const labels = fulfillment.labels ?? []
            const fulfillmentState = getFulfillmentStateLabel(fulfillment)
            const fulfillmentData = (fulfillment.data ??
              null) as Record<string, unknown> | null
            const ecpayStatusMessage =
              (fulfillmentData?.ecpay_status_message as string | undefined) ||
              (fulfillmentData?.RtnMsg as string | undefined)
            const ecpayLogisticsId =
              (fulfillmentData?.ecpay_logistics_id as string | undefined) ||
              (fulfillmentData?.AllPayLogisticsID as string | undefined)
            const ecpayStoreId =
              (fulfillmentData?.ReceiverStoreID as string | undefined) ||
              (fulfillmentData?.CVSStoreID as string | undefined)
            const ecpayPaymentNo = fulfillmentData?.CVSPaymentNo as
              | string
              | undefined
            const ecpayValidationNo = fulfillmentData?.CVSValidationNo as
              | string
              | undefined

            return (
              <div key={fulfillment.id} className="rm-panel grid gap-3 p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Text className="txt-medium-plus text-ui-fg-base">
                    {fulfillmentState} · {fulfillment.id}
                  </Text>
                  <Text className="txt-medium text-ui-fg-subtle">
                    {t(messages.order.provider, {
                      provider: fulfillment.provider_id ?? messages.order.notAvailable,
                    })}
                  </Text>
                </div>
                <div className="grid gap-1 text-ui-fg-subtle txt-medium">
                  {fulfillment.packed_at && (
                    <Text>
                      {t(messages.order.packedAt, {
                        date: new Date(fulfillment.packed_at).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {fulfillment.shipped_at && (
                    <Text data-testid="fulfillment-shipped-at">
                      {t(messages.order.shippedAt, {
                        date: new Date(fulfillment.shipped_at).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {fulfillment.delivered_at && (
                    <Text data-testid="fulfillment-delivered-at">
                      {t(messages.order.deliveredAt, {
                        date: new Date(fulfillment.delivered_at).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {fulfillment.canceled_at && (
                    <Text>
                      {t(messages.order.canceledAt, {
                        date: new Date(fulfillment.canceled_at).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {ecpayStatusMessage && (
                    <Text>
                      {t(messages.order.ecpayStatus, { status: ecpayStatusMessage })}
                    </Text>
                  )}
                  {ecpayLogisticsId && (
                    <Text>
                      {t(messages.order.ecpayLogisticsId, { id: ecpayLogisticsId })}
                    </Text>
                  )}
                  {ecpayStoreId && (
                    <Text>
                      {t(messages.order.ecpayStoreId, { id: ecpayStoreId })}
                    </Text>
                  )}
                  {ecpayPaymentNo && (
                    <Text>
                      {t(messages.order.cvsPaymentNo, { number: ecpayPaymentNo })}
                    </Text>
                  )}
                  {ecpayValidationNo && (
                    <Text>
                      {t(messages.order.cvsValidationNo, {
                        number: ecpayValidationNo,
                      })}
                    </Text>
                  )}
                </div>
                {labels.length > 0 && (
                  <div className="grid gap-2">
                    {labels.map((label, index) => (
                      <div key={`${fulfillment.id}-${index}`} className="grid gap-1 text-ui-fg-subtle txt-medium">
                        <Text data-testid="fulfillment-tracking-number">
                          {t(messages.order.tracking, {
                            tracking: label.tracking_number ?? messages.order.notAvailable,
                          })}
                        </Text>
                        {label.tracking_url && (
                          <a
                            href={label.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-grey-90 transition-colors hover:text-grey-70"
                            data-testid="fulfillment-tracking-link"
                          >
                            {messages.order.trackShipment}
                          </a>
                        )}
                        {label.label_url && (
                          <a
                            href={label.label_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-grey-90 transition-colors hover:text-grey-70"
                          >
                            {messages.order.viewLabel}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
