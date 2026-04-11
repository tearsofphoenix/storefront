"use client"

import { useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { PrestigeMegaMenuItem } from "../prestige-mega-menu"

type PrestigeSearchOverlayProps = {
  label: string
  closeLabel?: string
  categories: PrestigeMegaMenuItem[]
}

export default function PrestigeSearchOverlay({
  label,
  closeLabel = "Close",
  categories,
}: PrestigeSearchOverlayProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="prestige-nav-link text-[12px] font-medium uppercase tracking-[0.14em]"
      >
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] bg-black/35 px-4 py-6 backdrop-blur-[2px] small:px-8 small:py-10">
          <div
            className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-auto border"
            style={{
              borderColor: "var(--pi-border)",
              background: "var(--pi-bg)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4 small:px-8"
              style={{ borderColor: "var(--pi-border)" }}
            >
              <span
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{
                  color: "var(--pi-muted-soft)",
                  fontFamily: "var(--pi-heading-font)",
                }}
              >
                Search Collection
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="prestige-nav-link text-[11px] uppercase tracking-[0.18em]"
              >
                {closeLabel}
              </button>
            </div>

            <div className="grid gap-10 px-5 py-7 small:px-8 small:py-10">
              <form action="/store" className="grid gap-3">
                <label
                  htmlFor="prestige-search-input"
                  className="text-[11px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--pi-muted-soft)" }}
                >
                  Search by product name
                </label>
                <input
                  id="prestige-search-input"
                  name="q"
                  autoFocus
                  placeholder="e.g. leather tote, travel bottle..."
                  className="h-12 border px-4 text-base outline-none"
                  style={{
                    borderColor: "var(--pi-border)",
                    background: "var(--pi-surface)",
                    color: "var(--pi-text)",
                  }}
                />
              </form>

              <div className="grid gap-5 small:grid-cols-3">
                <LocalizedClientLink
                  href="/store"
                  onClick={() => setOpen(false)}
                  className="border p-4 text-sm transition-colors"
                  style={{
                    borderColor: "var(--pi-border)",
                    background: "var(--pi-surface)",
                  }}
                >
                  View all products
                </LocalizedClientLink>
                {categories.slice(0, 5).map((category) => (
                  <LocalizedClientLink
                    key={category.id}
                    href={`/categories/${category.handle}`}
                    onClick={() => setOpen(false)}
                    className="border p-4 text-sm transition-colors"
                    style={{
                      borderColor: "var(--pi-border)",
                      background: "var(--pi-surface)",
                    }}
                  >
                    {category.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
