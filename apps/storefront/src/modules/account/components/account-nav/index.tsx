"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import { useI18n } from "@lib/i18n/use-i18n"
import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import HeartIcon from "@modules/common/icons/heart"
import RewardIcon from "@modules/common/icons/reward"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const { messages, t } = useI18n()

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 border border-[var(--pi-border)] px-4 py-3 text-small-regular"
            data-testid="account-main-link"
            >
              <>
                <ChevronDown className="transform rotate-90" />
                <span>{messages.account.title}</span>
              </>
            </LocalizedClientLink>
        ) : (
          <>
            <div className="mb-4 text-xl font-semibold px-2">
              {t(messages.account.hello, { name: customer?.first_name ?? "" })}
            </div>
            <div className="text-base-regular">
              <ul className="overflow-hidden border border-[var(--pi-border)]">
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between border-b border-[var(--pi-border)] px-5 py-4"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>{messages.account.profile}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between border-b border-[var(--pi-border)] px-5 py-4"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>{messages.account.addresses}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between border-b border-[var(--pi-border)] px-5 py-4"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{messages.account.orders}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/loyalty"
                    className="flex items-center justify-between border-b border-[var(--pi-border)] px-5 py-4"
                    data-testid="loyalty-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <RewardIcon className="h-5 w-5" />
                      <span>{messages.account.loyalty}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/wishlists"
                    className="flex items-center justify-between border-b border-[var(--pi-border)] px-5 py-4"
                    data-testid="wishlists-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <HeartIcon className="w-5 h-5" />
                      <span>{messages.account.wishlists}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-4"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{messages.account.logOut}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div className="rm-panel-soft p-5">
          <div className="pb-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-grey-50">
              {messages.account.title}
            </h3>
          </div>
          <div className="text-base-regular">
            <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  {messages.account.overview}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  {messages.account.profile}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  {messages.account.addresses}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  {messages.account.orders}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/loyalty"
                  route={route!}
                  data-testid="loyalty-link"
                >
                  {messages.account.loyalty}
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/wishlists"
                  route={route!}
                  data-testid="wishlists-link"
                >
                  {messages.account.wishlists}
                </AccountNavLink>
              </li>
              <li className="text-grey-700">
                <button
                  type="button"
                  onClick={handleLogout}
                  data-testid="logout-button"
                  className="text-sm font-medium text-grey-60 transition-colors hover:text-grey-90"
                >
                  {messages.account.logOut}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx("text-sm text-grey-60 transition-colors hover:text-grey-90", {
        "font-semibold text-grey-90": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
