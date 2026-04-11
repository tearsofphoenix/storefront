"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type PrestigeMegaMenuItem = {
  id: string
  name: string
  handle: string
  children: Array<{
    id: string
    name: string
    handle: string
  }>
}

type PrestigeMegaMenuProps = {
  storeLabel: string
  accountLabel: string
  categories: PrestigeMegaMenuItem[]
}

export default function PrestigeMegaMenu({
  storeLabel,
  accountLabel,
  categories,
}: PrestigeMegaMenuProps) {
  return (
    <div className="hidden items-center gap-8 small:flex">
      <div className="group/mega relative">
        <button
          type="button"
          className="prestige-nav-link text-[12px] font-medium uppercase tracking-[0.14em]"
        >
          {storeLabel}
        </button>
        <div className="pointer-events-none absolute left-0 top-[calc(100%+14px)] z-[60] w-[min(88vw,920px)] -translate-y-2 opacity-0 transition-all duration-200 group-hover/mega:pointer-events-auto group-hover/mega:translate-y-0 group-hover/mega:opacity-100 group-focus-within/mega:pointer-events-auto group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100">
          <div
            className="grid grid-cols-[minmax(0,1fr)_280px] gap-8 border p-7"
            style={{
              borderColor: "var(--pi-border)",
              background: "var(--pi-surface)",
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="grid gap-3">
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-[11px] uppercase tracking-[0.16em]"
                    style={{
                      color: "var(--pi-muted-soft)",
                      fontFamily: "var(--pi-heading-font)",
                    }}
                  >
                    {category.name}
                  </LocalizedClientLink>
                  <ul className="grid gap-2">
                    {category.children.slice(0, 5).map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/categories/${child.handle}`}
                          className="prestige-nav-link text-sm"
                        >
                          {child.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              className="grid content-between border p-5"
              style={{
                borderColor: "var(--pi-border)",
                background:
                  "linear-gradient(155deg, rgba(201,169,110,0.2), rgba(255,255,255,0.92))",
              }}
            >
              <div className="grid gap-2">
                <span
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{
                    color: "var(--pi-muted-soft)",
                    fontFamily: "var(--pi-heading-font)",
                  }}
                >
                  Editorial Picks
                </span>
                <p
                  className="text-2xl leading-[1.15]"
                  style={{ fontFamily: "var(--pi-heading-font)" }}
                >
                  New season curation for elevated daily essentials.
                </p>
              </div>
              <LocalizedClientLink
                href="/store"
                className="theme-outline-button !mt-4 !w-full !justify-center"
              >
                Browse Collection
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
      <LocalizedClientLink
        href="/account"
        data-testid="nav-account-link"
        className="prestige-nav-link text-[12px] font-medium uppercase tracking-[0.14em]"
      >
        {accountLabel}
      </LocalizedClientLink>
    </div>
  )
}
