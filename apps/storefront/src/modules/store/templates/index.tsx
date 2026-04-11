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
  const isSymmetry = theme.themePresetKey === "symmetry"
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
      {isSymmetry ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { label: "Scheme one", background: "var(--pi-scheme-1-bg)", color: "var(--pi-scheme-1-text)" },
            { label: "Scheme two", background: "var(--pi-scheme-2-bg)", color: "var(--pi-scheme-2-text)" },
            { label: "Scheme three", background: "var(--pi-scheme-3-bg)", color: "var(--pi-scheme-3-text)" },
          ].map((scheme) => (
            <span
              key={scheme.label}
              className="inline-flex rounded-[999px] px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
              style={{ background: scheme.background, color: scheme.color }}
            >
              {scheme.label}
            </span>
          ))}
        </div>
      ) : null}
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
        />
      </Suspense>
    </section>
  )
}

export default StoreTemplate
