"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import { Button } from "@medusajs/ui"

type ECPayMapProps = {
  merchantId: string
  isTest: boolean
  logisticsSubType: string
  serverReplyUrl: string
  cartId?: string
  returnPath?: string
  disabled?: boolean
}

export default function ECPayMapSelector({
  merchantId,
  isTest,
  logisticsSubType = "FAMI",
  serverReplyUrl,
  cartId,
  returnPath,
  disabled = false,
}: ECPayMapProps) {
  const { messages } = useI18n()
  const isDisabled = disabled || !merchantId || !serverReplyUrl
  const extraData = new URLSearchParams({
    ...(cartId ? { cartId } : {}),
    ...(returnPath ? { returnPath } : {}),
  }).toString()
  const endpoint = isTest
    ? "https://logistics-stage.ecpay.com.tw/Express/map"
    : "https://logistics.ecpay.com.tw/Express/map"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // If it's blocked by another process, prevent default
    if (isDisabled) {
      e.preventDefault()
    }
  }

  return (
    <form action={endpoint} method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="MerchantID" value={merchantId} />
      <input type="hidden" name="LogisticsType" value="CVS" />
      <input type="hidden" name="LogisticsSubType" value={logisticsSubType} />
      <input type="hidden" name="IsCollection" value="N" />
      <input type="hidden" name="ServerReplyURL" value={serverReplyUrl} />
      <input type="hidden" name="ExtraData" value={extraData} />
      
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
