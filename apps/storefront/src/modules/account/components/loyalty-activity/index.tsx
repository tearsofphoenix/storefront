import type { LoyaltyActivity } from "@lib/util/loyalty"
import { getI18n } from "@lib/i18n/server"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type LoyaltyActivityListProps = {
  points: number
  activities: LoyaltyActivity[]
}

const LoyaltyActivityList = async ({
  points,
  activities,
}: LoyaltyActivityListProps) => {
  const { locale, messages, t } = await getI18n()
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  })

  return (
    <div className="flex flex-col gap-y-8">
      <div className="rm-panel-soft flex flex-col gap-y-4 p-5">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-large-semi">{messages.account.loyaltyBalance}</h2>
          <p className="text-base-regular text-ui-fg-subtle">
            {messages.account.loyaltyBalanceDescription}
          </p>
        </div>
        <div className="flex items-end gap-x-2">
          <span className="text-3xl-semi leading-none" data-testid="loyalty-balance">
            {points}
          </span>
          <span className="uppercase text-base-regular text-ui-fg-subtle">
            {messages.common.pointsAbbreviation}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-large-semi">{messages.account.loyaltyActivity}</h2>
          <p className="text-base-regular text-ui-fg-subtle">
            {messages.account.loyaltyActivityDescription}
          </p>
        </div>

        {activities.length > 0 ? (
          <ul className="flex flex-col gap-y-4" data-testid="loyalty-activity-list">
            {activities.map((activity) => {
              const orderLabel =
                activity.orderDisplayId !== null
                  ? String(activity.orderDisplayId)
                  : activity.orderId

              return (
                <li key={activity.id}>
                  <LocalizedClientLink href={`/account/orders/details/${activity.orderId}`}>
                    <div className="rm-panel flex items-center justify-between gap-4 p-5">
                      <div className="flex flex-col gap-y-2">
                        <span className="text-base-regular text-ui-fg-base">
                          {activity.type === "earned"
                            ? t(messages.account.loyaltyEarnedOrder, {
                                orderNumber: orderLabel,
                              })
                            : t(messages.account.loyaltyRedeemedOrder, {
                                orderNumber: orderLabel,
                              })}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 text-small-regular text-ui-fg-subtle">
                          <span>{dateFormatter.format(new Date(activity.createdAt))}</span>
                          <span>·</span>
                          <span>
                            {convertToLocale({
                              amount: activity.orderTotal,
                              currency_code: activity.currencyCode,
                            })}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-base-semi text-ui-fg-base"
                        data-testid={`loyalty-activity-${activity.type}`}
                      >
                        {activity.type === "earned" ? "+" : "-"}
                        {activity.points} {messages.common.pointsAbbreviation}
                      </span>
                    </div>
                  </LocalizedClientLink>
                </li>
              )
            })}
          </ul>
        ) : (
          <span className="text-base-regular" data-testid="no-loyalty-activity">
            {messages.account.noLoyaltyActivity}
          </span>
        )}
      </div>
    </div>
  )
}

export default LoyaltyActivityList
