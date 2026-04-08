import { Button, Container, Text } from "@medusajs/ui"
import { getI18n } from "@lib/i18n/server"
import { cookies as nextCookies } from "next/headers"

async function ProductOnboardingCta() {
  const { messages } = await getI18n()
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  if (!isOnboarding) {
    return null
  }

  return (
    <Container className="h-full w-full max-w-4xl bg-[#f3ede2] p-6 shadow-none">
      <div className="flex flex-col gap-y-4 center">
        <Text className="text-xl text-ui-fg-base">
          Your demo product is ready.
        </Text>
        <Text className="text-small-regular text-ui-fg-subtle">
          You can now continue setting up your store in the admin.
        </Text>
        <a href="http://localhost:7001/a/orders?onboarding_step=create_order_nextjs">
          <Button className="w-full bg-[#111827] text-white hover:bg-[#1f2937]">
            {messages.common.automaticActionCta}
          </Button>
        </a>
      </div>
    </Container>
  )
}

export default ProductOnboardingCta
