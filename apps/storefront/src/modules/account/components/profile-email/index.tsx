"use client"

import { useI18n } from "@lib/i18n/use-i18n"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const { messages } = useI18n()

  return (
    <div
      className="rm-panel p-5 text-small-regular"
      data-testid="account-email-editor"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50">
          {messages.common.email}
        </span>
        <Text className="font-semibold" data-testid="current-info">
          {customer.email}
        </Text>
      </div>
    </div>
  )
}

export default ProfileEmail
