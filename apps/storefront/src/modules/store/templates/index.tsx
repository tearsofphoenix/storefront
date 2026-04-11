import { Suspense } from "react"
import { getI18n } from "@lib/i18n/server"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isPorto = theme.themePresetKey === "porto"
  const isDawn = theme.themePresetKey === "dawn"
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <section className="content-container py-12 small:py-16" data-testid="category-container">
      <div
        className="mb-10 flex flex-col gap-4 border-b pb-8 small:flex-row small:items-end small:justify-between"
        style={{ borderColor: "var(--pi-border)" }}
      >
        <div className="grid gap-2">
          <h1
            className={
              isDawn
                ? "text-[2.2rem] leading-[1.04] small:text-[2.8rem]"
                : "text-[1.9rem] font-semibold small:text-[2.3rem]"
            }
            data-testid="store-page-title"
            style={isDawn ? { fontFamily: "var(--pi-heading-font)" } : undefined}
          >
            {messages.common.allProducts}
          </h1>
          <p className="max-w-[32rem] text-sm leading-6 small:text-base" style={{ color: "var(--pi-muted)" }}>
            {messages.store.catalogDescription}
          </p>
        </div>
        <RefinementList sortBy={sort} />
      </div>
      {isPorto ? (
        <div className="grid gap-8 small:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="grid gap-4 rounded-[2px] border border-[var(--pi-border)] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="grid gap-1">
              <h3
                className="text-xl uppercase tracking-[0.08em] text-[var(--pi-text)]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                Filter catalog
              </h3>
              <p className="text-sm leading-6 text-[var(--pi-muted)]">
                Dense demo controls inspired by Porto&apos;s multi-market product layouts.
              </p>
            </div>

            <div className="grid gap-3 border-t border-[var(--pi-border)] pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Price range
              </span>
              <div className="grid gap-2">
                <div className="h-2 rounded-full bg-[var(--pi-surface)]">
                  <div className="h-full w-[64%] rounded-full bg-[var(--pi-primary)]" />
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--pi-text)]">
                  <span>$50</span>
                  <span>$450</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-[var(--pi-border)] pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Brand
              </span>
              {["Porto House", "Studio North", "Atlas Works"].map((brand) => (
                <label key={brand} className="inline-flex items-center gap-2 text-sm text-[var(--pi-text)]">
                  <input type="checkbox" className="h-4 w-4 accent-[var(--pi-primary)]" />
                  {brand}
                </label>
              ))}
            </div>

            <div className="grid gap-3 border-t border-[var(--pi-border)] pt-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                Finish
              </span>
              <div className="flex flex-wrap gap-2">
                {["#0088cc", "#1f2937", "#d8eaf5", "#b45309"].map((color) => (
                  <span
                    key={color}
                    className="h-7 w-7 rounded-full border border-[var(--pi-border)]"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </aside>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      ) : (
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      )}
    </section>
  )
}

export default StoreTemplate
