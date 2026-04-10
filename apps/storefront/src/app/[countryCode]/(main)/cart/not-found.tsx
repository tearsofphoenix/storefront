import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"

import InteractiveLink from "@modules/common/components/interactive-link"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: "404",
    description: messages.common.unexpectedError,
  }
}

export default async function NotFound() {
  const { messages } = await getI18n()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {messages.common.pageNotFoundTitle}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {messages.common.cartNotFoundDescription}
      </p>
      <InteractiveLink href="/">{messages.common.goToFrontpage}</InteractiveLink>
    </div>
  )
}
