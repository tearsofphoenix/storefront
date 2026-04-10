import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { getI18n } from "@lib/i18n/server"
import { Metadata } from "next"
import Link from "next/link"

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
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="rm-panel grid gap-4 p-8 text-center">
        <h1 className="text-2xl font-semibold text-grey-90">
          {messages.common.pageNotFoundTitle}
        </h1>
        <p className="text-sm text-grey-60">
          {messages.common.pageNotFoundDescription}
        </p>
        <Link className="group flex items-center justify-center gap-x-1" href="/">
          <Text className="text-sm font-medium text-grey-70 transition-colors group-hover:text-grey-90">
            {messages.common.goToFrontpage}
          </Text>
          <ArrowUpRightMini
            className="ease-in-out duration-150 group-hover:rotate-45"
            color="#6b7280"
          />
        </Link>
      </div>
    </div>
  )
}
