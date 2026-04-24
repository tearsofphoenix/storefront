"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import { Button } from "@medusajs/ui"
import { useRef } from "react"

type ECPayMapProps = {
  merchantId: string
  isTest: boolean
  logisticsSubType: string
  serverReplyUrl: string
  cartId?: string
  extraData?: string
  disabled?: boolean
}

const buildMerchantTradeNo = (cartId?: string) => {
  const timeSegment = Date.now().toString(36).toUpperCase().slice(-8)
  const randomSegment = Math.random().toString(36).toUpperCase().slice(2, 5)
  const cartSegment = (cartId ?? "CART")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(-8)

  return `M${timeSegment}${randomSegment}${cartSegment}`.slice(0, 20)
}

export default function ECPayMapSelector({
  merchantId,
  isTest,
  logisticsSubType = "FAMI",
  serverReplyUrl,
  cartId,
  extraData,
  disabled = false,
}: ECPayMapProps) {
  const { messages } = useI18n()
  const isDisabled = disabled || !merchantId || !serverReplyUrl
  const endpoint = isTest
    ? "https://logistics-stage.ecpay.com.tw/Express/map"
    : "https://logistics.ecpay.com.tw/Express/map"
  const merchantTradeNoRef = useRef<HTMLInputElement>(null)
  const normalizedExtraData = (extraData ?? "").slice(0, 20)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }

    if (merchantTradeNoRef.current) {
      merchantTradeNoRef.current.value = buildMerchantTradeNo(cartId)
    }
  }

  return (
    <form action={endpoint} method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="MerchantID" value={merchantId} />
      <input
        ref={merchantTradeNoRef}
        type="hidden"
        name="MerchantTradeNo"
        defaultValue={buildMerchantTradeNo(cartId)}
      />
      <input type="hidden" name="LogisticsType" value="CVS" />
      <input type="hidden" name="LogisticsSubType" value={logisticsSubType} />
      <input type="hidden" name="IsCollection" value="N" />
      <input type="hidden" name="ServerReplyURL" value={serverReplyUrl} />
      <input type="hidden" name="ExtraData" value={normalizedExtraData} />
      <input type="hidden" name="Device" value="0" />
      
      <Button
        type="submit"
        disabled={isDisabled}
        className="theme-solid-button !mt-2 !h-10 !w-full !rounded-none"
      >
        {messages.common.selectCvsStore}
      </Button>
    </form>
  )
}
