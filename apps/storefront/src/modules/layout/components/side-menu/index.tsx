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
                enter="transform transition ease-out duration-200"
                enterFrom="-translate-x-4 opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transform transition ease-in duration-150"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-4 opacity-0"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] flex h-screen w-[min(88vw,24rem)] max-w-full text-sm sm:absolute sm:inset-y-auto sm:top-full sm:mt-3 sm:h-[calc(100vh-6rem)] sm:w-[23rem]">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex h-full w-full flex-col overflow-hidden rounded-none border-r px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-h-none sm:rounded-[18px] sm:border"
                    style={{
                      background: `${navBackground}`,
                      borderColor: "#d9dfe8",
                      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
                      color: "#111827",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] pb-5">
                      <LocalizedClientLink
                        href="/"
                        onClick={close}
                        data-testid="home-link"
                        className="min-w-0 text-[0.68rem] uppercase tracking-[0.14em] transition-colors hover:text-[#111827]"
                        style={{
                          color: "#6b7280",
                          fontFamily: headingFontFamily,
                        }}
                      >
                        {brandName}
                      </LocalizedClientLink>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9dfe8] bg-white transition-colors hover:bg-[#f7f7fa]"
                      >
                        <XMark />
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto pt-6">
                      <ul className="flex flex-col gap-2">
                        {sideMenuItems.map(({ label, href, testId }) => {
                          return (
                            <li key={href}>
                              <LocalizedClientLink
                                href={href}
                                className="flex min-h-12 items-center rounded-[14px] px-3 py-3 text-[1.65rem] leading-none tracking-[-0.03em] transition-colors hover:bg-[#f7f7fa]"
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

                      <div className="mt-auto pt-8">
                        <div className="overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-[#fbfbfd]">
                          {!!locales?.length && (
                            <div
                              className="flex items-start justify-between gap-3 border-b border-[#e5e7eb] px-4 py-3.5"
                              onMouseEnter={languageToggleState.open}
                              onMouseLeave={languageToggleState.close}
                            >
                              <div className="min-w-0 flex-1">
                                <LanguageSelect
                                  toggleState={languageToggleState}
                                  locales={locales}
                                  currentLocale={currentLocale}
                                />
                              </div>
                              <ArrowRightMini
                                className={clx(
                                  "mt-1.5 shrink-0 transition-transform duration-150",
                                  languageToggleState.state ? "-rotate-90" : ""
                                )}
                              />
                            </div>
                          )}
                          <div
                            className="flex items-start justify-between gap-3 px-4 py-3.5"
                            onMouseEnter={countryToggleState.open}
                            onMouseLeave={countryToggleState.close}
                          >
                            <div className="min-w-0 flex-1">
                              {regions && (
                                <CountrySelect
                                  toggleState={countryToggleState}
                                  regions={regions}
                                />
                              )}
                            </div>
                            <ArrowRightMini
                              className={clx(
                                "mt-1.5 shrink-0 transition-transform duration-150",
                                countryToggleState.state ? "-rotate-90" : ""
                              )}
                            />
                          </div>
                        </div>
                        <Text className="mt-4 text-[11px] leading-5 text-[#6b7280]">
                          © {new Date().getFullYear()} {brandName}.{" "}
                          {messages.common.rightsReserved}
                        </Text>
                      </div>
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
