"use client"

import { useState } from "react"

type DawnSearchProps = {
  placeholder?: string
}

export default function DawnSearch({
  placeholder = "Search products",
}: DawnSearchProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <form
      action="/store"
      className="relative flex items-center"
      onSubmit={() => setExpanded(false)}
    >
      <button
        type="button"
        aria-label="Search"
        onClick={() => setExpanded((current) => !current)}
        className="inline-flex h-9 w-9 items-center justify-center border border-transparent text-[var(--pi-muted)] transition-colors hover:text-[var(--pi-text)]"
      >
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
      </button>
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        className="h-9 border-b border-[var(--pi-border)] bg-transparent text-sm outline-none transition-all duration-150"
        style={{
          width: expanded ? "13rem" : "0",
          paddingLeft: expanded ? "0.35rem" : "0",
          opacity: expanded ? 1 : 0,
        }}
      />
    </form>
  )
}
