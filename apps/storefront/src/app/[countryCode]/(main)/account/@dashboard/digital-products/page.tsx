import { Metadata } from "next"

import { getI18n } from "@lib/i18n/server"
import { getCustomerDigitalProducts } from "../../../../../../lib/data/digital-products"
import { DigitalProductsList } from "../../../../../../modules/account/components/digital-products-list"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.digitalProducts,
    description: messages.account.digitalProductsDescription,
  }
}

export default async function DigitalProducts() {
  const { messages } = await getI18n()
  const digitalProducts = await getCustomerDigitalProducts()

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{messages.account.digitalProducts}</h1>
        <p className="text-base-regular">
          {messages.account.digitalProductsDescription}
        </p>
      </div>
      <div>
        <DigitalProductsList digitalProducts={digitalProducts} />
      </div>
    </div>
  )
}
