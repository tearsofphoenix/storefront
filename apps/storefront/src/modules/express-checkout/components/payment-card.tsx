"use client"

import { Button, Input, RadioGroup } from "@medusajs/ui"
import { useExpressCart } from "@providers/express-cart"
import { StepCard } from "./step-card"
import { useCallback, useEffect, useMemo, useState } from "react"
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
import { useI18n } from "@lib/i18n/use-i18n"
import ErrorMessage from "@modules/checkout/components/error-message"
import Thumbnail from "@modules/products/components/thumbnail"

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
  const [paymentCollection, setPaymentCollection] = useState<HttpTypes.StorePaymentCollection | null>(
    cart?.payment_collection ?? null
  )
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { messages, t } = useI18n()

  const activeSession = useMemo(() => {
    return (
      paymentCollection?.payment_sessions?.find((session) => session.status === "pending") ??
      paymentCollection?.payment_sessions?.[0] ??
      cart?.payment_collection?.payment_sessions?.find(
        (session) => session.status === "pending"
      ) ??
      cart?.payment_collection?.payment_sessions?.[0]
    )
  }, [cart?.payment_collection?.payment_sessions, paymentCollection?.payment_sessions])

  useEffect(() => {
    if (!cart) {
      setPaymentProviders([])
      setLoading(false)
      return
    }

    setLoading(true)
    setErrorMessage(null)

    sdk.store.payment
      .listPaymentProviders({
        region_id: cart.region_id || "",
      })
      .then(({ payment_providers }) => {
        setPaymentProviders(payment_providers)
        setLoading(false)
      })
      .catch(() => {
        setErrorMessage(messages.common.genericErrorRetry)
        setLoading(false)
      })
  }, [cart, cart?.region_id, messages.common.genericErrorRetry])

  useEffect(() => {
    if (cart?.payment_collection) {
      setPaymentCollection(cart.payment_collection)
    }
  }, [cart?.payment_collection])

  useEffect(() => {
    if (activeSession?.provider_id) {
      setSelectedPaymentProvider(activeSession.provider_id)
    }
  }, [activeSession?.provider_id])

  const initiateSession = useCallback(async (providerId: string) => {
    if (!providerId || !cart) return

    const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
    })
    setPaymentCollection(payment_collection)
  }, [cart])

  useEffect(() => {
    if (!selectedPaymentProvider || !cart) return

    setLoading(true)
    setErrorMessage(null)
    initiateSession(selectedPaymentProvider)
      .then(() => setLoading(false))
      .catch(() => {
        setErrorMessage(messages.common.genericErrorRetry)
        setLoading(false)
      })
  }, [cart, initiateSession, messages.common.genericErrorRetry, selectedPaymentProvider])

  const isFreeOrder = isZeroTotalCart(cart)

  const canPlaceOrder = useMemo(() => {
    if (isFreeOrder) return true
    if (!selectedPaymentProvider) return false
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
      return messages.common.cashOnDelivery
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
        const data = await sdk.store.cart.complete(cart.id)

        if (data.type === "cart") {
          setErrorMessage(data.error.message)
          setSubmitting(false)
          return
        }

        const session =
          paymentCollection?.payment_sessions?.find(
            (s) => s.provider_id === selectedPaymentProvider
          ) ?? activeSession

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

        unsetCart()
        router.push(`/${countryCode}/express/confirmation/${data.order.id}`)
        return
      }

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
        error instanceof Error ? error.message : messages.common.paymentConfirmationFailed
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <StepCard
      title={messages.common.payment}
      isActive={isActive}
      isDone={false}
      path={`${basePath}?step=payment`}
    >
      {loading && isActive && <Spinner />}

      <span className="text-sm font-medium">{messages.common.yourOrder}</span>
      {cart?.items?.map((item) => (
        <div className="flex gap-2" key={item.id}>
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            alt={item.product_title ?? ""}
            size="square"
            className="w-24 p-0"
          />
          <div className="flex flex-col gap-1">
            <span className="text-base">{item.product_title}</span>
            {item.variant?.options?.map((option) => (
              <span className="flex gap-1 text-sm" key={option.id}>
                <span className="text-ui-fg-muted">{option.option?.title}:</span>
                <span className="text-ui-fg-base">{option.value}</span>
              </span>
            ))}
            <span className="flex gap-1 text-sm items-center">
              <span className="text-ui-fg-muted">{messages.common.quantity}:</span>
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

      <div className="flex justify-between">
        <span className="text-sm text-ui-fg-muted">{messages.common.subtotal}:</span>
        <span className="text-sm text-ui-fg-base">
          {convertToLocale({ amount: cart?.item_subtotal || 0, currency_code: cart?.currency_code })}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-ui-fg-muted">{messages.common.shipping}:</span>
        <span className="text-sm text-ui-fg-base">
          {convertToLocale({ amount: cart?.shipping_total || 0, currency_code: cart?.currency_code })}
        </span>
      </div>
      <div className="flex justify-between font-medium">
        <span className="text-sm">{messages.common.total}:</span>
        <span className="text-sm">
          {convertToLocale({ amount: cart?.total || 0, currency_code: cart?.currency_code })}
        </span>
      </div>

      <hr className="bg-ui-bg-subtle" />

      <span className="text-sm font-medium">{messages.common.deliveryAddress}</span>
      <p className="text-xs text-ui-fg-muted">
        {cart?.shipping_address?.first_name} {cart?.shipping_address?.last_name}<br />
        {cart?.shipping_address?.address_1}<br />
        {cart?.shipping_address?.city}, {cart?.shipping_address?.postal_code}, {cart?.shipping_address?.country_code}
      </p>

      <hr className="bg-ui-bg-subtle" />

      <span className="text-sm font-medium">{messages.common.paymentMethod}</span>
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

      <ErrorMessage error={errorMessage} data-testid="express-payment-error" />

      <hr className="bg-ui-bg-subtle" />
      <Button
        className="w-full"
        disabled={!canPlaceOrder || submitting || loading}
        onClick={placeOrder}
        isLoading={submitting}
      >
        {t(messages.common.payAmount, {
          amount: convertToLocale({
            amount: cart?.total || 0,
            currency_code: cart?.currency_code,
          }),
        })}
      </Button>
    </StepCard>
  )
}
