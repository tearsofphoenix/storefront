"use client"

import { ExpressRouter } from "@modules/express-checkout/components/router"
import { use } from "react"

type PageProps = {
  params: Promise<{ countryCode: string; handle: string }>
}

export default function ExpressCheckoutPage({ params }: PageProps) {
  const { countryCode, handle } = use(params)

  return <ExpressRouter handle={handle} countryCode={countryCode} />
}
