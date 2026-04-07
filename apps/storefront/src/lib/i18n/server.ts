import "server-only"

import { getLocale } from "@lib/data/locale-actions"

import { getMessages, type I18nMessages } from "./messages"
import {
  defaultLocale,
  formatMessage,
  normalizeLocale,
  type SupportedLocale,
} from "./shared"

export async function getCurrentLocale(): Promise<SupportedLocale> {
  return normalizeLocale(await getLocale())
}

export function getLocaleMessages(locale?: string | null): I18nMessages {
  return getMessages(normalizeLocale(locale ?? defaultLocale))
}

export async function getI18n() {
  const locale = await getCurrentLocale()
  const messages = getMessages(locale)

  return {
    locale,
    messages,
    t: (template: string, values?: Record<string, string | number>) =>
      formatMessage(template, values),
  }
}
