import React from "react"
import { getI18n } from "@lib/i18n/server"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = async ({
  customer,
  children,
}) => {
  const { messages } = await getI18n()

  return (
    <div className="flex-1 py-10 small:py-12" data-testid="account-page">
      <div className="content-container rm-panel mx-auto flex h-full max-w-6xl flex-col p-6 small:p-8">
        <div className="grid grid-cols-1 gap-10 small:grid-cols-[240px_minmax(0,1fr)]">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="mt-10 flex flex-col gap-8 border-t border-[var(--pi-border)] pt-8 small:flex-row small:items-end small:justify-between">
          <div>
            <h3 className="mb-4 text-xl font-semibold text-grey-90">
              {messages.account.gotQuestions}
            </h3>
            <span className="txt-medium text-grey-60">
              {messages.account.customerServiceDescription}
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              {messages.account.customerServiceLink}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
