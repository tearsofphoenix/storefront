"use client"

import {
  isHostedRedirectPayment,
  isManual,
  isStripeLike,
  isZeroTotalCart,
} from "@lib/constants"
import {
  initiatePaymentSession,
  placeOrder,
  startHostedPaymentRedirect,
} from "@lib/data/cart"
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

  const paymentSession =
    cart.payment_collection?.payment_sessions?.find(
      (session) => session.status === "pending"
    ) ?? cart.payment_collection?.payment_sessions?.[0]

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
    case isHostedRedirectPayment(paymentSession?.provider_id):
      return (
        <HostedRedirectPaymentButton
          cart={cart}
          notReady={notReady}
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

const submitHostedPaymentForm = ({
  action,
  fields,
  method = "POST",
}: {
  action: string
  fields: Record<string, string>
  method?: string
}) => {
  const form = document.createElement("form")
  form.method = method
  form.action = action
  form.style.display = "none"

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = key
    input.value = value
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

const HostedRedirectPaymentButton = ({
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

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const sessions = cart.payment_collection?.payment_sessions ?? []
      const hostedProviderId =
        sessions.find(
          (session) =>
            session?.status === "pending" &&
            session?.provider_id &&
            isHostedRedirectPayment(session.provider_id)
        )?.provider_id ??
        sessions.find(
          (session) =>
            session?.provider_id && isHostedRedirectPayment(session.provider_id)
        )?.provider_id

      if (!hostedProviderId) {
        throw new Error(messages.common.hostedSessionMissing)
      }

      await initiatePaymentSession(cart, {
        provider_id: hostedProviderId,
        data: {
          cart_id: cart.id,
          country_code: cart.shipping_address?.country_code || "tw",
          email: cart.email,
          amount: cart.total,
          context: {
            items: cart.items,
          },
        },
      })

      const redirectData = await startHostedPaymentRedirect({
        cartId: cart.id,
        providerId: hostedProviderId,
      })

      if (!redirectData?.redirect_url || !redirectData?.form_fields) {
        throw new Error(messages.common.hostedRedirectDataMissing)
      }

      submitHostedPaymentForm({
        action: redirectData.redirect_url,
        fields: Object.fromEntries(
          Object.entries(
            redirectData.form_fields as Record<string, string | number>
          ).map(([key, value]) => [key, String(value)])
        ),
        method: String(redirectData.form_method || "POST"),
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : messages.common.failedToStartHostedPayment
      )
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="theme-solid-button !rounded-none"
        data-testid={dataTestId}
      >
        {messages.common.placeOrder}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="hosted-payment-error-message"
      />
    </>
  )
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
          setErrorMessage(messages.common.paymentProcessingHint)
          setSubmitting(false)
          return
        }

        setSubmitting(false)
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : messages.common.paymentConfirmationFailed
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
        className="theme-solid-button !rounded-none"
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
        className="theme-solid-button !rounded-none"
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
