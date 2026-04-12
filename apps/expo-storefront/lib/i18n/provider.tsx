import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getMessages, type I18nMessages } from "./messages";
import {
  defaultLocale,
  formatMessage,
  normalizeLocale,
  type SupportedLocale,
} from "./shared";

const LOCALE_STORAGE_KEY = "selected_locale";

export type I18nContextValue = {
  locale: SupportedLocale;
  messages: I18nMessages;
  ready: boolean;
  setLocale: (locale: string) => Promise<void>;
  t: (template: string, values?: Record<string, string | number>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((storedLocale) => {
        if (!mounted) {
          return;
        }

        setLocaleState(normalizeLocale(storedLocale ?? defaultLocale));
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback(async (nextLocale: string) => {
    const normalizedLocale = normalizeLocale(nextLocale);

    setLocaleState(normalizedLocale);
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, normalizedLocale);
  }, []);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      messages,
      ready,
      setLocale,
      t: (template, values) => formatMessage(template, values),
    };
  }, [locale, messages, ready, setLocale]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}
