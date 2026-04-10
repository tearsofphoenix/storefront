import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.common.customerServiceTitle,
    description: messages.common.customerServiceTitle,
  }
}

export default async function CustomerServicePage() {
  const { messages } = await getI18n()

  return (
    <div className="py-12 flex flex-col items-start justify-start min-h-[calc(100vh-64px)] content-container max-w-3xl mx-auto">
      <h1 className="text-3xl-semi text-ui-fg-base mb-8">
        {messages.common.customerServiceTitle}
      </h1>
      <div className="text-base-regular text-ui-fg-subtle text-left w-full space-y-4">
        <p>{messages.common.customerServicePlaceholder}</p>
        <p>{messages.common.customerServicePlaceholderHint}</p>
      </div>
    </div>
  )
}
