import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getStorefrontThemePresentation } from "@lib/util/theme-manifest"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }
  const theme = getStorefrontThemePresentation()
  const isPorto = theme.themePresetKey === "porto"
  const isDawn = theme.themePresetKey === "dawn"

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      {isPorto ? (
        <div className="mb-4 flex flex-col gap-3 border-t border-[var(--pi-border)] pt-4 small:flex-row small:items-center small:justify-between">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
            <span>{count} live results</span>
            <span>Dense grid</span>
            <span>Fast compare</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
            <span className="rounded-[2px] border border-[var(--pi-border)] px-2 py-1">2</span>
            <span className="rounded-[2px] border border-[var(--pi-primary)] bg-[var(--pi-surface-soft)] px-2 py-1 text-[var(--pi-primary)]">
              5
            </span>
          </div>
        </div>
      ) : null}
      <ul
        className={
          isPorto
            ? "grid w-full grid-cols-2 gap-4 border-t border-[var(--pi-border)] pt-5 small:grid-cols-3 medium:grid-cols-4 xl:grid-cols-5"
            : isDawn
            ? "grid w-full grid-cols-2 gap-x-5 gap-y-10 border-t border-[var(--pi-border)] pt-8 small:grid-cols-3"
            : "grid w-full grid-cols-2 gap-x-5 gap-y-12 border-t border-[var(--pi-border)] pt-8 small:grid-cols-4"
        }
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
