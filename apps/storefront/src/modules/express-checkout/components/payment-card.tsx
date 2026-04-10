"use client"

import { Button, Input, RadioGroup } from "@medusajs/ui"
import { useExpressCart } from "@providers/express-cart"
import { StepCard } from "./step-card"
import { useEffect, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { convertToLocale } from "@lib/util/money"
import { useRouter } from "next/navigation"
import {
  isHostedRedirectPayment,
  isManual,
  isStripeLike,
  isZeroTotalCart,
  paymentInfoMap,
} from "@lib/constants"
import { Spinner } from "@medusajs/icons"

type PaymentCardProps = {
  handle: string
  isActive: boolean
  basePath: string
  countryCode: string
}

export const PaymentCard = ({
  handle,
  isActive,
  basePath,
  countryCode
}: PaymentCardProps) => {
  const { cart, updateItemQuantity, unsetCart } = useExpressCart()
  const [loading, setLoading] = useState(true)
  const [paymentProviders, setPaymentProviders] = useState<HttpTypes.StorePaymentProvider[]>([])
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loading || !cart) return

    sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id || "",
    })
      .then(({ payment_providers }) => {
        setPaymentProviders(payment_providers)
        setLoading(false)
      })
  }, [loading, cart])

  const initiateSession = async (providerId: string) => {
    if (!providerId || !cart) return

    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
    })
  }

  useEffect(() => {
    if (!selectedPaymentProvider || !cart) return

    setLoading(true)
    initiateSession(selectedPaymentProvider)
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [selectedPaymentProvider])

  const isFreeOrder = isZeroTotalCart(cart)

  const canPlaceOrder = useMemo(() => {
    if (isFreeOrder) return true
    if (!selectedPaymentProvider) return false
    // For hosted redirect providers, allow placing order after session init
    if (isHostedRedirectPayment(selectedPaymentProvider)) return true
    if (isManual(selectedPaymentProvider)) return true
    if (isStripeLike(selectedPaymentProvider)) return true
    return true
  }, [selectedPaymentProvider, isFreeOrder])

  const getProviderTitle = (providerId: string) => {
    if (paymentInfoMap[providerId]) {
      return paymentInfoMap[providerId].title
    }
    if (providerId.startsWith("pp_system_default")) {
      return "Cash on Delivery"
    }
    return providerId
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

  const placeOrder = async () => {
    if (!cart || !canPlaceOrder) return
    setSubmitting(true)
    setErrorMessage(null)

    try {
      if (isHostedRedirectPayment(selectedPaymentProvider)) {
        // Complete the cart first, then redirect to hosted payment
        const data = await sdk.store.cart.complete(cart.id)

        if (data.type === "cart") {
          setErrorMessage(data.error.message)
          setSubmitting(false)
          return
        }

        // Get redirect data from payment session
        const session = cart.payment_collection?.payment_sessions?.find(
          (s) => s.provider_id === selectedPaymentProvider
        )

        if (session?.data && typeof session.data === "object") {
          const sessionData = session.data as Record<string, unknown>
          if (sessionData.redirect_url && sessionData.form_fields) {
            submitHostedPaymentForm({
              action: String(sessionData.redirect_url),
              fields: Object.fromEntries(
                Object.entries(
                  sessionData.form_fields as Record<string, string | number>
                ).map(([key, value]) => [key, String(value)])
              ),
              method: String(sessionData.form_method || "POST"),
            })
            return
          }
        }

        // Fallback: redirect to confirmation
        unsetCart()
        router.push(`/${countryCode}/express/confirmation/${data.order.id}`)
        return
      }

      // Standard flow (Stripe, Manual, etc.)
      const data = await sdk.store.cart.complete(cart.id)

      if (data.type === "cart") {
        setErrorMessage(data.error.message)
        setSubmitting(false)
      } else {
        unsetCart()
        router.push(`/${countryCode}/express/confirmation/${data.order.id}`)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed"
      )
      setSubmitting(false)
    }
  }

  return (
    <StepCard
      title="Payment"
      isActive={isActive}
      isDone={false}
      path={`${basePath}?step=payment`}
    >
      {loading && isActive && <Spinner />}

      {/* Order summary */}
      <span className="text-sm font-medium">Your order</span>
      {cart?.items?.map((item) => (
        <div className="flex gap-2" key={item.id}>
          <img src={item.thumbnail || ""} alt={item.title} className="w-24 h-24 rounded object-cover" />
          <div className="flex flex-col gap-1">
            <span className="text-base">{item.product_title}</span>
            {item.variant?.options?.map((option) => (
              <span className="flex gap-1 text-sm" key={option.id}>
                <span className="text-ui-fg-muted">{option.option?.title}:</span>
                <span className="text-ui-fg-base">{option.value}</span>
              </span>
            ))}
            <span className="flex gap-1 text-sm items-center">
              <span className="text-ui-fg-muted">Qty:</span>
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  if (!e.target.value) return
                  updateItemQuantity(item.id, parseInt(e.target.value))
                }}
                className="w-20"
              />
            </span>
          </div>
        </div>
      ))}

      <hr className="bg-ui-bg-subtle" />

      {/* Totals */}
      <div className="flex justify-between">
        <span className="text-sm text-ui-fg-muted">Subtotal:</span>
        <span className="text-sm text-ui-fg-base">
          {convertToLocale({ amount: cart?.item_subtotal || 0, currency_code: cart?.currency_code })}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-ui-fg-muted">Shipping:</span>
        <span className="text-sm text-ui-fg-base">
          {convertToLocale({ amount: cart?.shipping_total || 0, currency_code: cart?.currency_code })}
        </span>
      </div>
      <div className="flex justify-between font-medium">
        <span className="text-sm">Total:</span>
        <span className="text-sm">
          {convertToLocale({ amount: cart?.total || 0, currency_code: cart?.currency_code })}
        </span>
      </div>

      <hr className="bg-ui-bg-subtle" />

      {/* Delivery address summary */}
      <span className="text-sm font-medium">Delivery address</span>
      <p className="text-xs text-ui-fg-muted">
        {cart?.shipping_address?.first_name} {cart?.shipping_address?.last_name}<br />
        {cart?.shipping_address?.address_1}<br />
        {cart?.shipping_address?.city}, {cart?.shipping_address?.postal_code}, {cart?.shipping_address?.country_code}
      </p>

      <hr className="bg-ui-bg-subtle" />

      {/* Payment method selection */}
      <span className="text-sm font-medium">Payment method</span>
      <div className="flex flex-col gap-2">
        <RadioGroup
          value={selectedPaymentProvider}
          onValueChange={(value) => setSelectedPaymentProvider(value)}
        >
          {paymentProviders.map((provider) => (
            <div className="flex gap-1 items-center" key={provider.id}>
              <RadioGroup.Item value={provider.id} />
              <span className="text-sm">{getProviderTitle(provider.id)}</span>
            </div>
          ))}
        </RadioGroup>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <hr className="bg-ui-bg-subtle" />
      <Button
        className="w-full"
        disabled={!canPlaceOrder || submitting || loading}
        onClick={placeOrder}
        isLoading={submitting}
      >
        Pay {convertToLocale({ amount: cart?.total || 0, currency_code: cart?.currency_code })}
      </Button>
    </StepCard>
  )
}
