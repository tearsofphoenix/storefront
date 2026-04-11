"use client"

import { applyLoyaltyPoints, removeLoyaltyPoints } from "@lib/data/loyalty"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import ErrorMessage from "../error-message"

type LoyaltyPointsProps = {
  cart: HttpTypes.StoreCart
  points: number | null
}

const LoyaltyPoints = ({ cart, points }: LoyaltyPointsProps) => {
  const router = useRouter()
  const { messages } = useI18n()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasLoyaltyPromotion = useMemo(() => {
    const metadataPromoId = (cart as any)?.metadata?.loyalty_promo_id

    if (metadataPromoId) {
      return true
    }

    return (
      cart.promotions?.some((promotion) =>
        Boolean(promotion?.code?.startsWith("LOYALTY-"))
      ) || false
    )
  }, [cart])

  if (points === null) {
    return null
  }

  const canApply = points > 0

  const handleToggle = async () => {
    setErrorMessage("")
    setIsSubmitting(true)

    try {
      if (hasLoyaltyPromotion) {
        await removeLoyaltyPoints(cart.id)
      } else {
        await applyLoyaltyPoints(cart.id)
      }

      router.refresh()
    } catch (error: any) {
      setErrorMessage(error?.message || messages.common.loyaltyUpdateFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <Heading className="txt-medium">{messages.common.loyaltyPoints}</Heading>
        <Text className="txt-small text-ui-fg-subtle">
          {points} {messages.common.pointsAbbreviation}
        </Text>
      </div>

      <Text className="txt-small text-ui-fg-subtle">
        {hasLoyaltyPromotion
          ? messages.common.loyaltyAppliedToCart
          : messages.common.loyaltyApplyDescription}
      </Text>

      <Button
        variant={hasLoyaltyPromotion ? "secondary" : "primary"}
        size="small"
        isLoading={isSubmitting}
        onClick={handleToggle}
        disabled={isSubmitting || (!hasLoyaltyPromotion && !canApply)}
        data-testid="loyalty-points-button"
      >
        {hasLoyaltyPromotion
          ? messages.common.removeLoyaltyPoints
          : messages.common.applyLoyaltyPoints}
      </Button>

      <ErrorMessage error={errorMessage} data-testid="loyalty-points-error" />
    </div>
  )
}

export default LoyaltyPoints
