import { HttpTypes } from "@medusajs/types"

type LoyaltyAdjustment = {
  amount?: number | null
  code?: string | null
  promotion_id?: string | null
}

export type LoyaltyActivity = {
  id: string
  type: "earned" | "redeemed"
  points: number
  orderId: string
  orderDisplayId: number | null
  createdAt: string
  orderTotal: number
  currencyCode: string
}

export type LoyaltyOrderSummary = {
  earnedPoints: number
  redeemedPoints: number
  hasLoyaltyPromotion: boolean
  hasLoyaltyActivity: boolean
}

const LOYALTY_PROMOTION_PREFIX = "LOYALTY-"

export const calculatePointsFromAmount = (amount: number | null | undefined) => {
  return Math.max(0, Math.floor(amount ?? 0))
}

const getMetadataRecord = (metadata: unknown): Record<string, unknown> => {
  if (metadata && typeof metadata === "object") {
    return metadata as Record<string, unknown>
  }

  return {}
}

const getLoyaltyPromotionId = (order: HttpTypes.StoreOrder) => {
  const metadata = getMetadataRecord(order.metadata)
  const loyaltyPromoId = metadata.loyalty_promo_id

  return typeof loyaltyPromoId === "string" ? loyaltyPromoId : null
}

const isLoyaltyPromotionCode = (code: string | null | undefined) => {
  return (
    typeof code === "string" &&
    code.toUpperCase().startsWith(LOYALTY_PROMOTION_PREFIX)
  )
}

const collectOrderAdjustments = (
  order: HttpTypes.StoreOrder
): LoyaltyAdjustment[] => {
  const itemAdjustments =
    order.items?.flatMap((item) => item.adjustments ?? []) ?? []
  const shippingAdjustments =
    order.shipping_methods?.flatMap((method) => method.adjustments ?? []) ?? []

  return [...itemAdjustments, ...shippingAdjustments]
}

export const getOrderLoyaltySummary = (
  order: HttpTypes.StoreOrder
): LoyaltyOrderSummary => {
  const loyaltyPromoId = getLoyaltyPromotionId(order)
  const redeemedAmount = collectOrderAdjustments(order).reduce(
    (total, adjustment) => {
      const matchesPromotionId =
        Boolean(loyaltyPromoId) && adjustment.promotion_id === loyaltyPromoId

      if (!matchesPromotionId && !isLoyaltyPromotionCode(adjustment.code)) {
        return total
      }

      return total + Math.max(0, adjustment.amount ?? 0)
    },
    0
  )

  const redeemedPoints = calculatePointsFromAmount(redeemedAmount)
  const hasLoyaltyPromotion = redeemedPoints > 0 || Boolean(loyaltyPromoId)
  const earnedPoints = hasLoyaltyPromotion
    ? 0
    : calculatePointsFromAmount(order.total)

  return {
    earnedPoints,
    redeemedPoints,
    hasLoyaltyPromotion,
    hasLoyaltyActivity: earnedPoints > 0 || redeemedPoints > 0,
  }
}

export const buildLoyaltyActivities = (
  orders: HttpTypes.StoreOrder[]
): LoyaltyActivity[] => {
  return orders
    .flatMap((order) => {
      const summary = getOrderLoyaltySummary(order)
      const activities: LoyaltyActivity[] = []
      const createdAt =
        typeof order.created_at === "string"
          ? order.created_at
          : order.created_at.toISOString()

      if (summary.redeemedPoints > 0) {
        activities.push({
          id: `${order.id}-redeemed`,
          type: "redeemed",
          points: summary.redeemedPoints,
          orderId: order.id,
          orderDisplayId: order.display_id ?? null,
          createdAt,
          orderTotal: order.total ?? 0,
          currencyCode: order.currency_code,
        })
      }

      if (summary.earnedPoints > 0) {
        activities.push({
          id: `${order.id}-earned`,
          type: "earned",
          points: summary.earnedPoints,
          orderId: order.id,
          orderDisplayId: order.display_id ?? null,
          createdAt,
          orderTotal: order.total ?? 0,
          currencyCode: order.currency_code,
        })
      }

      return activities
    })
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )
}
