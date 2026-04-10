"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import { Locale } from "@lib/data/locales"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

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
  brandName,
  primaryColor: _primaryColor,
  navBackground = "var(--rm-bg)",
  headingFontFamily = "reMarkableSans, Helvetica, sans-serif",
  bodyFontFamily = "reMarkableSans, Helvetica, sans-serif",
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const { messages } = useI18n()
  const resolvedBrandName = brandName || messages.home.metadataTitle

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
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative flex items-center border-b border-transparent px-0 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ease-out duration-200 focus:outline-none"
                  style={{
                    background: "transparent",
                    color: "var(--rm-text)",
                  }}
                >
                  {messages.common.menu}
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="pointer-events-auto fixed inset-0 z-[50] bg-black/5 backdrop-blur-[1px]"
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
                    className="flex h-full w-full flex-col overflow-hidden rounded-none border-r px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-h-none sm:border"
                    style={{
                      background: navBackground,
                      borderColor: "var(--rm-border)",
                      boxShadow: "none",
                      color: "var(--rm-text)",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    <div
                      className="flex items-start justify-between gap-4 border-b pb-5"
                      style={{ borderColor: "var(--rm-border)" }}
                    >
                      <LocalizedClientLink
                        href="/"
                        onClick={close}
                        data-testid="home-link"
                        className="min-w-0 text-[0.68rem] uppercase tracking-[0.16em]"
                        style={{
                          color: "var(--rm-muted-soft)",
                          fontFamily: headingFontFamily,
                        }}
                      >
                        {resolvedBrandName}
                      </LocalizedClientLink>
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="flex h-11 w-11 items-center justify-center border transition-colors"
                        style={{
                          borderColor: "var(--rm-border)",
                          background: "var(--rm-surface)",
                        }}
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
                                className="flex min-h-12 items-center px-0 py-3 text-[1.72rem] leading-none tracking-[-0.03em]"
                                onClick={close}
                                data-testid={testId}
                                style={{
                                  color: "var(--rm-text)",
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
                        <div
                          className="overflow-hidden border"
                          style={{
                            borderColor: "var(--rm-border)",
                            background: "var(--rm-surface)",
                          }}
                        >
                          {!!locales?.length && (
                            <div
                              className="flex items-start justify-between gap-3 border-b px-4 py-3.5"
                              style={{ borderColor: "var(--rm-border)" }}
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
                        <Text
                          className="mt-4 text-[11px] leading-5"
                          style={{ color: "var(--rm-muted-soft)" }}
                        >
                          © {new Date().getFullYear()} {resolvedBrandName}.{" "}
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
