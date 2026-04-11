"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"

import {
  listStorefrontThemePresets,
  resolveStorefrontThemePresetKey,
  STOREFRONT_THEME_COOKIE_KEY,
  type StorefrontThemePresetKey,
} from "@lib/util/theme-presets"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const THEME_OPTIONS = listStorefrontThemePresets().map((preset) => ({
  key: preset.key,
  label: preset.name,
}))

type ThemeSwitcherProps = {
  className?: string
}

export default function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedTheme, setSelectedTheme] = useState<StorefrontThemePresetKey>("dawn")
  const optionMap = useMemo(
    () => new Set(THEME_OPTIONS.map((option) => option.key)),
    []
  )

  useEffect(() => {
    const fromDom = document.documentElement.getAttribute("data-theme")
    const resolved = resolveStorefrontThemePresetKey(fromDom)
    if (optionMap.has(resolved)) {
      setSelectedTheme(resolved)
    }
  }, [optionMap])

  const handleChange = (nextTheme: string) => {
    const resolvedTheme = resolveStorefrontThemePresetKey(nextTheme)
    setSelectedTheme(resolvedTheme)
    document.documentElement.setAttribute("data-theme", resolvedTheme)
    document.cookie = `${STOREFRONT_THEME_COOKIE_KEY}=${resolvedTheme}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        htmlFor="theme-switcher"
        className="text-[10px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: "var(--pi-muted-soft)" }}
      >
        Theme
      </label>
      <select
        id="theme-switcher"
        value={selectedTheme}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isPending}
        className="h-9 border bg-transparent px-2 text-[11px] uppercase tracking-[0.08em] outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          borderColor: "var(--pi-border)",
          color: "var(--pi-text)",
          background: "var(--pi-surface)",
        }}
      >
        {THEME_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
