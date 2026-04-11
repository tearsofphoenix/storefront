"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type EmpireMegaMenuItem = {
  id: string
  name: string
  handle: string
  children: Array<{
    id: string
    name: string
    handle: string
    children?: Array<{
      id: string
      name: string
      handle: string
    }>
  }>
}

type EmpireMegaMenuProps = {
  categories: EmpireMegaMenuItem[]
  storeLabel: string
}

export default function EmpireMegaMenu({
  categories,
  storeLabel,
}: EmpireMegaMenuProps) {
  return (
    <div className="group/empire-menu relative hidden small:block">
      <button
        type="button"
        className="empire-nav-link text-[12px] font-semibold uppercase tracking-[0.12em]"
      >
        {storeLabel}
      </button>
      <div className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-[80] w-[min(94vw,1080px)] -translate-y-2 opacity-0 transition-all duration-200 group-hover/empire-menu:pointer-events-auto group-hover/empire-menu:translate-y-0 group-hover/empire-menu:opacity-100 group-focus-within/empire-menu:pointer-events-auto group-focus-within/empire-menu:translate-y-0 group-focus-within/empire-menu:opacity-100">
        <div
          className="grid grid-cols-[minmax(0,1fr)_260px] gap-6 rounded-[4px] border p-6"
          style={{
            borderColor: "var(--pi-border)",
            background: "#fff",
            boxShadow: "0 18px 42px rgba(17, 17, 17, 0.16)",
          }}
        >
          <div className="grid grid-cols-3 gap-5">
            {categories.map((category) => (
              <div key={category.id} className="grid gap-2">
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#91500a]"
                >
                  {category.name}
                </LocalizedClientLink>
                <ul className="grid gap-1.5">
                  {category.children.slice(0, 6).map((child) => (
                    <li key={child.id}>
                      <LocalizedClientLink
                        href={`/categories/${child.handle}`}
                        className="empire-nav-link text-sm"
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
                "linear-gradient(145deg, rgba(255,216,20,0.36), rgba(228,121,17,0.2))",
            }}
          >
            <div className="grid gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#91500a]">
                Business bulk deal
              </span>
              <p className="text-2xl leading-[1.05] text-[#131313]">
                Save more with volume bundles and fast replenishment.
              </p>
            </div>
            <LocalizedClientLink
              href="/store?sortBy=created_at"
              className="theme-solid-button !mt-4 !w-full !justify-center !rounded-[20px] !border-[#ffd814] !bg-[#ffd814] !text-[#0f1111]"
            >
              Browse deals
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
