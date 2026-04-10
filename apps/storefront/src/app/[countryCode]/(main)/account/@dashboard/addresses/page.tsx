import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getI18n } from "@lib/i18n/server"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.addresses,
    description: messages.account.addressesDescription,
  }
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { messages } = await getI18n()
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{messages.account.shippingAddresses}</h1>
        <p className="text-base-regular">
          {messages.account.addressesDescription}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
