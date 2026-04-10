"use client"

import { ExpressRegionProvider } from "@providers/express-region"
import { ExpressCartProvider } from "@providers/express-cart"
import { Suspense } from "react"
import { Spinner } from "@medusajs/icons"
import { SummaryCol } from "@modules/express-checkout/components/summary-col"

type LayoutProps = {
  children: React.ReactNode
}

export default function ExpressCheckoutLayout({ children }: LayoutProps) {
  return (
    <ExpressRegionProvider>
      <ExpressCartProvider>
        <div className="flex gap-4 justify-center items-start min-h-screen w-full py-8 px-4 bg-ui-bg-subtle">
          <div className="flex flex-col gap-2 lg:w-[379px] w-full max-w-lg">
            <Suspense fallback={<Spinner />}>
              {children}
            </Suspense>
          </div>
          <div className="hidden lg:block">
            <SummaryCol />
          </div>
        </div>
      </ExpressCartProvider>
    </ExpressRegionProvider>
  )
}
