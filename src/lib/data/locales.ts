"use server"

import { sdk } from "@lib/config"
import {
  getLocaleLabel,
  normalizeLocale,
  supportedLocales,
} from "@lib/i18n/shared"
import { getCacheOptions } from "./cookies"

export type Locale = {
  code: string
  name: string
}

const getSupportedLocaleFallback = (): Locale[] => {
  const raw =
    process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ?? supportedLocales.join(",")
  const locales = raw
    .split(",")
    .map((entry) => normalizeLocale(entry.trim()))
    .filter(Boolean)

  const deduped = Array.from(
    new Set(locales.length > 0 ? locales : supportedLocales)
  )

  return deduped.map((code) => ({
    code,
    name: getLocaleLabel(code),
  }))
}

/**
 * Fetches available locales from the backend.
 * Returns null if the endpoint returns 404 (locales not configured).
 */
export const listLocales = async (): Promise<Locale[] | null> => {
  const next = {
    ...(await getCacheOptions("locales")),
  }

  return sdk.client
    .fetch<{ locales: Locale[] }>(`/store/locales`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ locales }) => {
      if (!locales?.length) {
        return getSupportedLocaleFallback()
      }

      const normalizedLocales = Array.from(
        new Map(
          locales.map((locale) => {
            const code = normalizeLocale(locale.code)
            return [
              code,
              {
                code,
                name: locale.name?.trim() || getLocaleLabel(code),
              },
            ]
          })
        ).values()
      )

      return normalizedLocales.length
        ? normalizedLocales
        : getSupportedLocaleFallback()
    })
    .catch(() => getSupportedLocaleFallback())
}
