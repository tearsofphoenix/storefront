import { convertToLocale } from "@lib/util/money"
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
  const fulfillments = getOrderFulfillments(order)

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Delivery
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            Shipping Address
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
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Contact</Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address?.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">Method</Text>
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
          <Text className="txt-medium-plus text-ui-fg-base">Fulfillment timeline</Text>
          {fulfillments.map((fulfillment) => {
            const labels = fulfillment.labels ?? []
            const fulfillmentState = getFulfillmentStateLabel(fulfillment)

            return (
              <div key={fulfillment.id} className="border border-gray-200 rounded-rounded p-4 grid gap-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Text className="txt-medium-plus text-ui-fg-base">
                    {fulfillmentState} · {fulfillment.id}
                  </Text>
                  <Text className="txt-medium text-ui-fg-subtle">
                    Provider {fulfillment.provider_id ?? "n/a"}
                  </Text>
                </div>
                <div className="grid gap-1 text-ui-fg-subtle txt-medium">
                  {fulfillment.packed_at && (
                    <Text>Packed at: {new Date(fulfillment.packed_at).toLocaleString()}</Text>
                  )}
                  {fulfillment.shipped_at && (
                    <Text data-testid="fulfillment-shipped-at">
                      Shipped at: {new Date(fulfillment.shipped_at).toLocaleString()}
                    </Text>
                  )}
                  {fulfillment.delivered_at && (
                    <Text data-testid="fulfillment-delivered-at">
                      Delivered at: {new Date(fulfillment.delivered_at).toLocaleString()}
                    </Text>
                  )}
                  {fulfillment.canceled_at && (
                    <Text>Canceled at: {new Date(fulfillment.canceled_at).toLocaleString()}</Text>
                  )}
                </div>
                {labels.length > 0 && (
                  <div className="grid gap-2">
                    {labels.map((label, index) => (
                      <div key={`${fulfillment.id}-${index}`} className="grid gap-1 text-ui-fg-subtle txt-medium">
                        <Text data-testid="fulfillment-tracking-number">
                          Tracking: {label.tracking_number ?? "n/a"}
                        </Text>
                        {label.tracking_url && (
                          <a
                            href={label.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ui-fg-interactive"
                            data-testid="fulfillment-tracking-link"
                          >
                            Track shipment
                          </a>
                        )}
                        {label.label_url && (
                          <a
                            href={label.label_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ui-fg-interactive"
                          >
                            View label
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
