import { Suspense } from "react"
import { getI18n } from "@lib/i18n/server"
import { listCategories } from "@lib/data/categories"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  view,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  view?: "grid" | "list"
  countryCode: string
}) => {
  const { messages } = await getI18n()
  const theme = getStorefrontThemePresentation()
  const isEmpire = theme.themePresetKey === "warehouse"
  const categories = isEmpire ? await listCategories({ limit: 14 }) : []
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const viewMode = view === "list" ? "list" : "grid"

  return (
    <section className="content-container py-12 small:py-16" data-testid="category-container">
      <div
        className="mb-10 flex flex-col gap-4 border-b pb-8 small:flex-row small:items-end small:justify-between"
        style={{ borderColor: "var(--pi-border)" }}
      >
        <div className="grid gap-2">
          <h1 className="text-[1.9rem] font-semibold small:text-[2.3rem]" data-testid="store-page-title">
            {messages.common.allProducts}
          </h1>
          <p className="max-w-[32rem] text-sm leading-6 small:text-base" style={{ color: "var(--pi-muted)" }}>
            {messages.store.catalogDescription}
          </p>
        </div>
        <RefinementList sortBy={sort} />
      </div>
      {isEmpire ? (
        <div className="grid gap-8 small:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[4px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--pi-text)]">
              Departments
            </h3>
            <ul className="mt-3 grid gap-2">
              {categories
                .filter((category) => !category.parent_category)
                .slice(0, 8)
                .map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="inline-flex text-sm text-[var(--pi-muted)] transition-colors hover:text-[var(--pi-text)]"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
            </ul>
            <div className="mt-5 border-t border-[var(--pi-border)] pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pi-muted-soft)]">
                View mode
              </p>
              <div className="mt-2 flex gap-2">
                <LocalizedClientLink
                  href={`/store?sortBy=${sort}&view=grid`}
                  className={`rounded-[16px] border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                    viewMode === "grid"
                      ? "border-[#ffd814] bg-[#ffd814] text-[#0f1111]"
                      : "border-[var(--pi-border)] text-[var(--pi-muted)]"
                  }`}
                >
                  Grid
                </LocalizedClientLink>
                <LocalizedClientLink
                  href={`/store?sortBy=${sort}&view=list`}
                  className={`rounded-[16px] border px-3 py-1.5 text-xs uppercase tracking-[0.12em] ${
                    viewMode === "list"
                      ? "border-[#ffd814] bg-[#ffd814] text-[#0f1111]"
                      : "border-[var(--pi-border)] text-[var(--pi-muted)]"
                  }`}
                >
                  List
                </LocalizedClientLink>
              </div>
            </div>
          </aside>
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              viewMode={viewMode}
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
