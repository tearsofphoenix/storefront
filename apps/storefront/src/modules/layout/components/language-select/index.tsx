"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"
import { useI18n } from "@lib/i18n/use-i18n"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
}

/**
 * Gets the localized display name for a language code using Intl API.
 * Falls back to the provided name if Intl is unavailable.
 */
const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { locale, messages } = useI18n()

  const { state, open, close } = toggleState

  const options = useMemo(() => {
    const localeOptions = locales.map((entry) => ({
      code: entry.code,
      name: entry.name,
      localizedName: getLocalizedLanguageName(
        entry.code,
        entry.name,
        currentLocale ?? locale
      ),
      countryCode: getCountryCodeFromLocale(entry.code),
    }))

    return localeOptions
  }, [currentLocale, locale, locales])

  useEffect(() => {
    const option = options.find(
      (item) => item.code.toLowerCase() === (currentLocale ?? "").toLowerCase()
    )

    setCurrent(option ?? options[0])
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div className="w-full">
      <Listbox
        as="span"
        onChange={handleChange}
        value={current}
        disabled={isPending}
      >
        <ListboxButton
          className="w-full py-1 text-left"
          onClick={() => (state ? close() : open())}
        >
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>{messages.common.language}:</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {current.countryCode && (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                {isPending ? "..." : current.localizedName}
              </span>
            )}
          </div>
        </ListboxButton>
        <Transition
          show={state}
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <ListboxOptions
            className="mt-3 max-h-[220px] w-full overflow-y-auto border bg-white text-small-regular uppercase text-black no-scrollbar"
            style={{ borderColor: "var(--pi-border)", boxShadow: "none" }}
            static
          >
            {options.map((o) => (
              <ListboxOption
                key={o.code}
                value={o}
                className="flex cursor-pointer items-center gap-x-2 px-3 py-2 transition-colors"
                style={{ color: "var(--pi-text)" }}
              >
                {o.countryCode ? (
                  /* @ts-ignore */
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={o.countryCode}
                  />
                ) : (
                  <span style={{ width: "16px", height: "16px" }} />
                )}
                {o.localizedName}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
