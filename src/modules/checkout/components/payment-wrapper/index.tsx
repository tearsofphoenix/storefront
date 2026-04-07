"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isStripeLike, isZeroTotalCart } from "@lib/constants"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  stripeKey?: string | null
  medusaAccountId?: string | null
  children: React.ReactNode
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({
  cart,
  stripeKey,
  medusaAccountId,
  children,
}) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const isFreeOrder = isZeroTotalCart(cart)
  const resolvedStripeKey = stripeKey ?? undefined
  const stripePromise = stripeKey
    ? loadStripe(
        stripeKey,
        medusaAccountId ? { stripeAccount: medusaAccountId } : undefined
      )
    : null

  if (
    !isFreeOrder &&
    isStripeLike(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={resolvedStripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
