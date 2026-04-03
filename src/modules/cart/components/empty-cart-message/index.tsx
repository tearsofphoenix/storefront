import { Heading, Text } from "@medusajs/ui"

import { getI18n } from "@lib/i18n/server"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = async () => {
  const { messages } = await getI18n()

  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {messages.common.cartEmptyTitle}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {messages.common.cartEmptyDescription}
      </Text>
      <div>
        <InteractiveLink href="/store">
          {messages.common.exploreProducts}
        </InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
