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
  const isWoodmart = theme.themePresetKey === "woodmart"
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
      {isWoodmart ? (
        <div className="grid gap-8 small:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--pi-text)]">
              Filters
            </h3>
            <div className="mt-4 grid gap-4 text-sm text-[var(--pi-muted)]">
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                  Material
                </span>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" />
                  Oak
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" />
                  Walnut
                </label>
              </div>
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
                  Tone
                </span>
                <div className="flex gap-2">
                  <span className="h-4 w-4 rounded-full bg-[#c8975a]" />
                  <span className="h-4 w-4 rounded-full bg-[#6b5545]" />
                  <span className="h-4 w-4 rounded-full bg-[#e8dfd5]" />
                </div>
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
