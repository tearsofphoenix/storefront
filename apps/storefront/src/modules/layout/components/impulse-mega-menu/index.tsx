"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type ImpulseMegaMenuItem = {
  id: string
  name: string
  handle: string
  children: Array<{
    id: string
    name: string
    handle: string
  }>
}

type ImpulseMegaMenuProps = {
  categories: ImpulseMegaMenuItem[]
  storeLabel: string
  accountLabel: string
}

export default function ImpulseMegaMenu({
  categories,
  storeLabel,
  accountLabel,
}: ImpulseMegaMenuProps) {
  return (
    <div className="hidden items-center gap-8 small:flex">
      <div className="group/impulse-menu relative">
        <button
          type="button"
          className="impulse-nav-link text-[12px] font-semibold uppercase tracking-[0.14em]"
        >
          {storeLabel}
        </button>

        <div className="pointer-events-none absolute left-0 top-[calc(100%+10px)] z-[70] w-[min(92vw,980px)] -translate-y-2 opacity-0 transition-all duration-200 group-hover/impulse-menu:pointer-events-auto group-hover/impulse-menu:translate-y-0 group-hover/impulse-menu:opacity-100 group-focus-within/impulse-menu:pointer-events-auto group-focus-within/impulse-menu:translate-y-0 group-focus-within/impulse-menu:opacity-100">
          <div
            className="grid grid-cols-[minmax(0,1fr)_260px] gap-8 border p-6"
            style={{
              borderColor: "var(--pi-border)",
              background: "var(--pi-bg)",
              boxShadow: "0 18px 48px rgba(16, 16, 16, 0.15)",
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category) => (
                <div key={category.id} className="grid gap-3">
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--pi-primary)" }}
                  >
                    {category.name}
                  </LocalizedClientLink>
                  <ul className="grid gap-2">
                    {category.children.slice(0, 5).map((child) => (
                      <li key={child.id}>
                        <LocalizedClientLink
                          href={`/categories/${child.handle}`}
                          className="impulse-nav-link text-sm"
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
              className="grid content-between rounded-[4px] border p-4"
              style={{
                borderColor: "var(--pi-border)",
                background:
                  "linear-gradient(152deg, rgba(232,40,58,0.16), rgba(255,107,53,0.12))",
              }}
            >
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#b61e31]">
                  Flash Deal
                </span>
                <p className="text-2xl leading-[1.05] text-[#1c1c1c]">
                  Up to 30% off selected products this week.
                </p>
              </div>
              <LocalizedClientLink
                href="/store?sortBy=created_at"
                className="theme-solid-button !mt-4 !w-full !justify-center !rounded-[2px] !border-[#e8283a] !bg-[#e8283a]"
              >
                Shop deals
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      <LocalizedClientLink
        href="/account"
        data-testid="nav-account-link"
        className="impulse-nav-link text-[12px] font-semibold uppercase tracking-[0.14em]"
      >
        {accountLabel}
      </LocalizedClientLink>
    </div>
  )
}
