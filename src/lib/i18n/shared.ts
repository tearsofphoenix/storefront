export const supportedLocales = ["en-US", "fr-FR", "zh-Hant"] as const

export type SupportedLocale = (typeof supportedLocales)[number]

export const localeLabels: Record<SupportedLocale, string> = {
  "en-US": "English",
  "fr-FR": "Français",
  "zh-Hant": "繁體中文",
}

const localeAliases: Record<string, SupportedLocale> = {
  en: "en-US",
  "en-us": "en-US",
  "en-gb": "en-US",
  fr: "fr-FR",
  "fr-fr": "fr-FR",
  zh: "zh-Hant",
  "zh-hant": "zh-Hant",
  "zh-tw": "zh-Hant",
  "zh-hk": "zh-Hant",
  "zh-mo": "zh-Hant",
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  if (!locale) {
    return "en-US"
  }

  const normalized = locale.trim().replaceAll("_", "-").toLowerCase()

  if (localeAliases[normalized]) {
    return localeAliases[normalized]
  }

  if (normalized.startsWith("fr")) {
    return "fr-FR"
  }

  if (normalized.startsWith("zh")) {
    return "zh-Hant"
  }

  if (normalized.startsWith("en")) {
    return "en-US"
  }

  return "en-US"
}

export const defaultLocale: SupportedLocale = normalizeLocale(
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE
)

export function isSupportedLocale(locale?: string | null): locale is SupportedLocale {
  return supportedLocales.includes(normalizeLocale(locale))
}

export function getLocaleLabel(locale?: string | null) {
  return localeLabels[normalizeLocale(locale)]
}

export function formatMessage(
  template: string,
  values?: Record<string, string | number>
) {
  if (!values) {
    return template
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{${key}}`, String(value))
  }, template)
}
