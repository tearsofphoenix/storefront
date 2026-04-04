"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import { useI18n } from "@lib/i18n/use-i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  brandName?: string
  primaryColor?: string
  navBackground?: string
  headingFontFamily?: string
  bodyFontFamily?: string
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  brandName = "Panda Store",
  primaryColor = "#2559f4",
  navBackground = "#ffffff",
  headingFontFamily = "var(--font-heading), Poppins, sans-serif",
  bodyFontFamily = "var(--font-body), Quicksand, sans-serif",
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const { messages } = useI18n()

  const sideMenuItems = [
    { label: brandName, href: "/", testId: "home-link" },
    { label: messages.common.store, href: "/store", testId: "store-link" },
    {
      label: messages.common.account,
      href: "/account",
      testId: "account-link",
    },
    { label: messages.common.cart, href: "/cart", testId: "cart-link" },
  ]

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative flex items-center rounded-md border px-3 py-2 text-[13px] font-medium transition-colors ease-out duration-200 focus:outline-none"
                  style={{
                    borderColor: "#d9dfe8",
                    background: "#ffffff",
                    color: "#111827",
                  }}
                >
                  {messages.common.menu}
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="absolute inset-x-0 z-[51] m-2 flex h-[calc(100vh-1rem)] w-full flex-col pr-4 text-sm sm:min-w-min sm:w-1/3 sm:pr-0 2xl:w-1/4">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full flex-col justify-between rounded-[14px] p-6"
                    style={{
                      background: `${navBackground}`,
                      border: "1px solid #d9dfe8",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                      color: "#111827",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.68rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontFamily: headingFontFamily,
                      }}
                    >
                      {brandName}
                    </div>
                    <div className="flex justify-end" id="xmark">
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="rounded-md border border-[#d9dfe8] p-2"
                      >
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col items-start justify-start gap-4">
                      {sideMenuItems.map(({ label, href, testId }) => {
                        return (
                          <li key={href}>
                            <LocalizedClientLink
                              href={href}
                              className="text-[1.75rem] leading-9 transition-colors hover:text-grey-60"
                              onClick={close}
                              data-testid={testId}
                              style={{
                                color: "#111827",
                                fontFamily: headingFontFamily,
                              }}
                            >
                              {label}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small text-grey-50">
                        © {new Date().getFullYear()} {brandName}.{" "}
                        {messages.common.rightsReserved}
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
