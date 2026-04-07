"use client"

import { isManual, isStripeLike, isZeroTotalCart } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const buildBillingDetails = (cart: HttpTypes.StoreCart) => ({
  name:
    `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim() ||
    undefined,
  address: {
    city: cart.billing_address?.city ?? undefined,
    country: cart.billing_address?.country_code ?? undefined,
    line1: cart.billing_address?.address_1 ?? undefined,
    line2: cart.billing_address?.address_2 ?? undefined,
    postal_code: cart.billing_address?.postal_code ?? undefined,
    state: cart.billing_address?.province ?? undefined,
  },
  email: cart.email || undefined,
  phone: cart.billing_address?.phone ?? undefined,
})

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const { messages } = useI18n()
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1
  const isFreeOrder = isZeroTotalCart(cart)

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isFreeOrder:
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>{messages.common.selectPaymentMethod}</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const { messages } = useI18n()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !elements || !cart || !session?.data?.client_secret) {
      setSubmitting(false)
      return
    }

    const { error: submitError } = await elements.submit()

    if (submitError) {
      setErrorMessage(submitError.message || null)
      setSubmitting(false)
      return
    }

    await stripe
      .confirmPayment({
        elements,
        clientSecret: session.data.client_secret as string,
        confirmParams: {
          payment_method_data: {
            billing_details: buildBillingDetails(cart),
          },
        },
        redirect: "if_required",
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          } else {
            setSubmitting(false)
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent?.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        if (paymentIntent?.status === "processing") {
          setErrorMessage(
            "Payment is processing. Please wait a moment and refresh if the order page does not update."
          )
          setSubmitting(false)
          return
        }

        setSubmitting(false)
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Payment confirmation failed."
        )
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        {messages.common.placeOrder}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const { messages } = useI18n()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        {messages.common.placeOrder}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
