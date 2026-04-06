"use client"

import { Button } from "@medusajs/ui"
import { useI18n } from "@lib/i18n/use-i18n"

type ECPayMapProps = {
  merchantId?: string
  isTest?: boolean
  logisticsSubType: string
  serverReplyUrl: string
  disabled?: boolean
}

export default function ECPayMapSelector({
  merchantId = "2000132",
  isTest = true,
  logisticsSubType = "FAMI",
  serverReplyUrl,
  disabled = false,
}: ECPayMapProps) {
  const { messages } = useI18n()
  const endpoint = isTest
    ? "https://logistics-stage.ecpay.com.tw/Express/map"
    : "https://logistics.ecpay.com.tw/Express/map"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // If it's blocked by another process, prevent default
    if (disabled) {
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
      
      <Button
        type="submit"
        disabled={disabled}
        className="w-full h-10 mt-2 rounded-md bg-[#111827] text-white hover:bg-[#1f2937]"
      >
        {"Select CVS Store"}
      </Button>
    </form>
  )
}
