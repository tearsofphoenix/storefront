import { HttpTypes } from "@medusajs/types"

export type OrderFulfillmentLabel = {
  tracking_number?: string | null
  tracking_url?: string | null
  label_url?: string | null
}

export type OrderFulfillmentWithLabels = HttpTypes.StoreOrderFulfillment & {
  labels?: OrderFulfillmentLabel[] | null
}

export function getOrderFulfillments(
  order: HttpTypes.StoreOrder
): OrderFulfillmentWithLabels[] {
  return ((order.fulfillments ?? []) as OrderFulfillmentWithLabels[])
    .filter(Boolean)
    .sort((a, b) => {
      return (
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
      )
    })
}

export function getLatestOrderFulfillment(
  order: HttpTypes.StoreOrder
): OrderFulfillmentWithLabels | null {
  return getOrderFulfillments(order)[0] ?? null
}

export function getFulfillmentStateLabel(
  fulfillment: OrderFulfillmentWithLabels
): string {
  if (fulfillment.delivered_at) {
    return "Delivered"
  }

  if (fulfillment.shipped_at) {
    return "Shipped"
  }

  if (fulfillment.canceled_at) {
    return "Canceled"
  }

  if (fulfillment.packed_at) {
    return "Packed"
  }

  return "Pending"
}

export function getPrimaryFulfillmentLabel(
  fulfillment: OrderFulfillmentWithLabels | null
): OrderFulfillmentLabel | null {
  return fulfillment?.labels?.[0] ?? null
}

