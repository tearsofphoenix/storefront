import { Container } from "@medusajs/ui"
import { getI18n } from "@lib/i18n/server"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { retrieveWishlist } from "@lib/data/wishlist"
import { retrieveLoyaltyPoints } from "@lib/data/loyalty"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = async ({ customer, orders }: OverviewProps) => {
  const { messages, t } = await getI18n()
  const wishlist = await retrieveWishlist()
  const loyaltyPoints = await retrieveLoyaltyPoints()
  const wishlistItemCount = wishlist?.items?.length || 0

  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="mb-6 flex items-center justify-between">
          <span data-testid="welcome-message" data-value={customer?.first_name}>
            <span className="text-2xl font-semibold text-grey-90">
              {t(messages.account.hello, { name: customer?.first_name ?? "" })}
            </span>
          </span>
          <span className="text-small-regular text-ui-fg-base">
            {messages.account.signedInAs}:{" "}
            <span
              className="font-semibold"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col border-t border-[var(--pi-border)] py-8">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="mb-6 grid gap-4 small:grid-cols-4">
              <div className="rm-panel-soft flex flex-col gap-y-4 p-5">
                <h3 className="text-large-semi">{messages.account.profile}</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    {messages.account.completed}
                  </span>
                </div>
              </div>

              <div className="rm-panel-soft flex flex-col gap-y-4 p-5">
                <h3 className="text-large-semi">{messages.account.addresses}</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    {messages.account.saved}
                  </span>
                </div>
              </div>

              <div className="rm-panel-soft flex flex-col gap-y-4 p-5">
                <h3 className="text-large-semi">{messages.account.wishlists}</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="wishlist-count"
                    data-value={wishlistItemCount}
                  >
                    {wishlistItemCount}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    {wishlistItemCount === 1
                      ? messages.common.item.toLowerCase()
                      : messages.account.items}
                  </span>
                </div>
              </div>

              <div className="rm-panel-soft flex flex-col gap-y-4 p-5">
                <h3 className="text-large-semi">{messages.account.loyalty}</h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-3xl-semi leading-none"
                    data-testid="loyalty-points-count"
                    data-value={loyaltyPoints ?? 0}
                  >
                    {loyaltyPoints ?? 0}
                  </span>
                  <span className="uppercase text-base-regular text-ui-fg-subtle">
                    {messages.common.pointsAbbreviation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">{messages.account.recentOrders}</h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                          <Container className="rm-panel flex items-center justify-between p-5 shadow-none">
                            <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                              <span className="font-semibold">{messages.account.datePlaced}</span>
                              <span className="font-semibold">
                                {messages.account.orderNumber}
                              </span>
                              <span className="font-semibold">
                                {messages.account.totalAmount}
                              </span>
                              <span data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">
                    {messages.account.noRecentOrders}
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
