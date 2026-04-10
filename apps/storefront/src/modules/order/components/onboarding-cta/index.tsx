"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { useI18n } from "@lib/i18n/use-i18n"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const { messages } = useI18n()

  return (
    <Container className="rm-panel h-full w-full max-w-4xl shadow-none">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {messages.order.testOrderReady}
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {messages.order.completeSetupPrompt}
        </Text>
        <Button
          className="theme-solid-button !w-fit !rounded-none"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {messages.common.automaticActionCta}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
