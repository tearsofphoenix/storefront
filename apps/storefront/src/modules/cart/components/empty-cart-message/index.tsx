import { Heading, Text } from "@medusajs/ui"

import { getI18n } from "@lib/i18n/server"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = async () => {
  const { messages } = await getI18n()

  return (
    <div
      className="flex items-start justify-center px-2 py-24 small:py-36"
      data-testid="empty-cart-message"
    >
      <div className="rm-panel grid max-w-[38rem] gap-5 p-8 small:p-10">
        <Heading
          level="h1"
          className="flex flex-row items-baseline gap-x-2 text-3xl-regular"
        >
          {messages.common.cartEmptyTitle}
        </Heading>
        <Text className="mt-4 mb-6 max-w-[32rem] text-base-regular">
          {messages.common.cartEmptyDescription}
        </Text>
        <div>
          <InteractiveLink href="/store">
            {messages.common.exploreProducts}
          </InteractiveLink>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartMessage
