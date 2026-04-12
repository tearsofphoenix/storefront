"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useExpressCart } from "@providers/express-cart"
import { useEffect, useMemo } from "react"
import { ProductCard } from "./product-card"
import { AddressCard } from "./address-card"
import { ShippingCard } from "./shipping-card"
import { PaymentCard } from "./payment-card"

type ActiveTab = "product" | "address" | "shipping" | "payment"

type RouterProps = {
  handle: string
  countryCode: string
}

export const ExpressRouter = ({
  handle,
  countryCode
}: RouterProps) => {
  const { cart } = useExpressCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = searchParams.get("step")

  const basePath = `/${countryCode}/express/${handle}`

  const isCartValid = useMemo(() => {
    return cart?.items?.[0]?.product_handle === handle
  }, [cart, handle])

  const activeTab: ActiveTab = currentStep === "product" || currentStep === "address" ||
    currentStep === "shipping" || currentStep === "payment" ? currentStep : "product"

  useEffect(() => {
    if (!cart) return

    if ((activeTab !== "product") && !isCartValid) {
      return router.push(basePath)
    }

    if (activeTab === "shipping" && (!cart?.shipping_address || !cart?.billing_address)) {
      return router.push(`${basePath}?step=address`)
    }

    if (activeTab === "payment" && (
      !cart?.shipping_address || !cart?.billing_address || !cart?.shipping_methods?.length
    )) {
      return router.push(`${basePath}?step=shipping`)
    }
  }, [activeTab, basePath, cart, isCartValid, router])

  return (
    <>
      <ProductCard handle={handle} isActive={activeTab === "product"} basePath={basePath} />
      <AddressCard handle={handle} isActive={activeTab === "address"} basePath={basePath} />
      <ShippingCard handle={handle} isActive={activeTab === "shipping"} basePath={basePath} />
      <PaymentCard handle={handle} isActive={activeTab === "payment"} basePath={basePath} countryCode={countryCode} />
    </>
  )
}
