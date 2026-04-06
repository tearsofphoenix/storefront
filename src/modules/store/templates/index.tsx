import { Suspense } from "react"
import { getI18n } from "@lib/i18n/server"

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
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <section className="content-container py-10" data-testid="category-container">
      <div className="mb-8 flex flex-col gap-4 border-b border-[#e5e7eb] pb-6 small:flex-row small:items-end small:justify-between">
        <div className="grid gap-2">
          <h1 className="text-[1.75rem] font-semibold text-grey-80 small:text-[2rem]" data-testid="store-page-title">
            {messages.common.allProducts}
          </h1>
          <p className="max-w-[32rem] text-sm leading-6 text-grey-60 small:text-base">
            {messages.store.catalogDescription}
          </p>
        </div>
        <RefinementList sortBy={sort} />
      </div>
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
