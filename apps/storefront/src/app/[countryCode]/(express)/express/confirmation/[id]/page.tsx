import { sdk } from "@lib/config"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"

type PageProps = {
  params: Promise<{ id: string; countryCode: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Order Confirmed",
  }
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params

  const { order } = await sdk.store.order.retrieve(id)

  return (
    <div className="bg-white rounded-lg py-6 px-6 w-full max-w-lg shadow-sm border border-gray-200 flex gap-4 flex-col">
      <Heading level="h2">Thank you, {order.shipping_address?.first_name}!</Heading>
      <p className="text-ui-fg-subtle">
        Your order has been placed. We are working to get it settled.
      </p>
      <hr className="border-gray-200" />
      <div className="flex gap-2 flex-col">
        <span className="flex gap-1">
          <span className="text-sm text-ui-fg-muted">Order number:</span>
          <span className="text-sm text-ui-fg-base">{order.display_id}</span>
        </span>
        <span className="flex gap-1">
          <span className="text-sm text-ui-fg-muted">Order date:</span>
          <span className="text-sm text-ui-fg-base">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </span>
      </div>
    </div>
  )
}
