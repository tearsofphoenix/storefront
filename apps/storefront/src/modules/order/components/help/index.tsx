"use client"

import { Heading } from "@medusajs/ui"
import { useI18n } from "@lib/i18n/use-i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  const { messages } = useI18n()

  return (
    <div className="rm-panel-soft mt-6 p-5">
      <Heading className="text-base-semi">{messages.order.needHelp}</Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/customer-service">
              {messages.order.contact}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/customer-service">
              {messages.order.returnsAndExchanges}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
