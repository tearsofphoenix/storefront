"use client"

import { createContext, useMemo } from "react"

import { getMessages, type I18nMessages } from "./messages"
import {
  defaultLocale,
  formatMessage,
  normalizeLocale,
  type SupportedLocale,
} from "./shared"

export type I18nContextValue = {
  locale: SupportedLocale
  messages: I18nMessages
  t: (template: string, values?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

type I18nProviderProps = {
  locale?: string | null
  messages?: I18nMessages
  children: React.ReactNode
}

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  const normalizedLocale = normalizeLocale(locale ?? defaultLocale)

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale: normalizedLocale,
      messages: messages ?? getMessages(normalizedLocale),
      t: (template, values) => formatMessage(template, values),
    }
  }, [messages, normalizedLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
