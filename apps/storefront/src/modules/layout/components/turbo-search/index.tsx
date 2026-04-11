"use client"

import { useDeferredValue, useMemo, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type TurboSearchSuggestion = {
  label: string
  href: string
  type: "product" | "category"
}

type TurboSearchProps = {
  suggestions: TurboSearchSuggestion[]
}

export default function TurboSearch({ suggestions }: TurboSearchProps) {
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)

  const filteredSuggestions = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    if (!normalized) {
      return suggestions.slice(0, 6)
    }

    return suggestions
      .filter((suggestion) => suggestion.label.toLowerCase().includes(normalized))
      .slice(0, 6)
  }, [deferredQuery, suggestions])

  return (
    <div className="relative w-full">
      <form action="/store" className="relative">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, categories, brands"
          className="h-11 w-full rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] px-4 pr-11 text-sm text-[var(--pi-text)] outline-none transition-colors focus:border-[var(--pi-primary)]"
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-[var(--pi-muted)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 11.5L14 14M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </form>
      <div className="absolute inset-x-0 top-[calc(100%+8px)] z-[70] rounded-[4px] border border-[var(--pi-border)] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
        <ul className="grid gap-1 p-2">
          {filteredSuggestions.map((suggestion) => (
            <li key={`${suggestion.type}-${suggestion.href}`}>
              <LocalizedClientLink
                href={suggestion.href}
                className="flex items-center justify-between rounded-[4px] px-3 py-2 text-sm text-[var(--pi-text)] transition-colors hover:bg-[var(--pi-surface-soft)]"
              >
                <span>{suggestion.label}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                  {suggestion.type}
                </span>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
