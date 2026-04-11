import { Metadata } from "next"

import { listLoyaltyActivities, retrieveLoyaltyPoints } from "@lib/data/loyalty"
import { getI18n } from "@lib/i18n/server"
import LoyaltyActivityList from "@modules/account/components/loyalty-activity"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.loyalty,
    description: messages.account.loyaltyDescription,
  }
}

export default async function LoyaltyPage() {
  const { messages } = await getI18n()
  const [points, activities] = await Promise.all([
    retrieveLoyaltyPoints(),
    listLoyaltyActivities(),
  ])

  return (
    <div className="w-full" data-testid="loyalty-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{messages.account.loyalty}</h1>
        <p className="text-base-regular">
          {messages.account.loyaltyDescription}
        </p>
      </div>
      <LoyaltyActivityList points={points ?? 0} activities={activities} />
    </div>
  )
}
