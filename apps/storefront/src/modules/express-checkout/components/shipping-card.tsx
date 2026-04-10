"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useExpressCart } from "@providers/express-cart"
import { StepCard } from "./step-card"
import { Button, RadioGroup } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { convertToLocale } from "@lib/util/money"
import { useRouter } from "next/navigation"

type ShippingCardProps = {
  handle: string
  isActive: boolean
  basePath: string
}

export const ShippingCard = ({
  handle,
  isActive,
  basePath
}: ShippingCardProps) => {
  const { cart, updateCart } = useExpressCart()
  const [loading, setLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState(cart?.shipping_methods?.[0]?.shipping_option_id || "")
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([])
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    if (shippingOptions.length || !cart) return

    sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id || "",
    })
      .then(({ shipping_options }) => {
        setShippingOptions(shipping_options)
        setLoading(false)
      })
  }, [shippingOptions, cart])

  useEffect(() => {
    if (!cart || !shippingOptions.length) return

    const promises = shippingOptions
      .filter((so) => so.price_type === "calculated")
      .map((so) =>
        sdk.client.fetch(`/store/shipping-options/${so.id}/calculate`, {
          method: "POST",
          body: {
            cart_id: cart.id,
            data: {}
          }
        }) as Promise<{ shipping_option: HttpTypes.StoreCartShippingOption }>
      )

    if (promises.length) {
      Promise.allSettled(promises).then((res) => {
        const pricesMap: Record<string, number> = {}
        res
          .filter((r) => r.status === "fulfilled")
          .forEach((p) => (pricesMap[p.value?.shipping_option.id || ""] = p.value?.shipping_option.amount))

        setCalculatedPrices(pricesMap)
      })
    }
  }, [shippingOptions, cart])

  const getShippingOptionPrice = useCallback((shippingOption: HttpTypes.StoreCartShippingOption) => {
    const price = shippingOption.price_type === "flat"
      ? shippingOption.amount
      : calculatedPrices[shippingOption.id]

    return convertToLocale({ amount: price || 0, currency_code: cart?.currency_code })
  }, [calculatedPrices])

  const isButtonDisabled = useMemo(() => {
    return loading || !shippingMethod
  }, [shippingMethod, loading])

  const handleSubmit = () => {
    if (isButtonDisabled) return

    setLoading(true)

    updateCart({
      shippingMethodData: {
        option_id: shippingMethod,
        data: {}
      }
    })
      .then(() => {
        setLoading(false)
        router.push(`${basePath}?step=payment`)
      })
  }

  return (
    <StepCard
      title="Shipping"
      isActive={isActive}
      isDone={!!cart?.shipping_methods?.length}
      path={`${basePath}?step=shipping`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <RadioGroup
            value={shippingMethod}
            onValueChange={(value) => setShippingMethod(value)}
          >
            {shippingOptions.map((so) => (
              <div className="flex gap-1" key={so.id}>
                <RadioGroup.Item value={so.id} />
                <div className="flex justify-between w-full gap-2">
                  <span className="text-sm">{so.name}</span>
                  <span className="text-xs text-ui-fg-muted">{getShippingOptionPrice(so)}</span>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <hr className="bg-ui-bg-subtle" />
        <Button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className="w-full"
        >
          Go to payment
        </Button>
      </div>
    </StepCard>
  )
}
