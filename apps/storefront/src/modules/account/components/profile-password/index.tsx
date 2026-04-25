"use client"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useI18n } from "@lib/i18n/use-i18n"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const { messages } = useI18n()

  return (
    <div
      className="rm-panel p-5 text-small-regular"
      data-testid="account-password-editor"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50">
          {messages.common.password}
        </span>
        <Text className="font-semibold">
          {messages.account.passwordHiddenReason}
        </Text>
        <Text className="text-sm text-ui-fg-muted">
          {messages.account.passwordUpdateNotImplemented}
        </Text>
      </div>
    </div>
  )
}

export default ProfilePassword
