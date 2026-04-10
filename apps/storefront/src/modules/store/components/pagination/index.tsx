"use client"

import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const renderPageButton = (
    pageNumber: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={pageNumber}
      className={clx(
        "inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-medium transition-colors",
        {
          "border-[var(--rm-text)] bg-[var(--rm-text)] text-white": isCurrent,
          "border-[var(--rm-border)] bg-white text-grey-60 hover:border-[var(--rm-border-strong)] hover:text-grey-90":
            !isCurrent,
        }
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(pageNumber)}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-grey-50"
    >
      ...
    </span>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
      return buttons
    }

    if (page <= 4) {
      buttons.push(
        ...arrayRange(1, 5).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis-start"))
      buttons.push(renderPageButton(totalPages, totalPages, totalPages === page))
      return buttons
    }

    if (page >= totalPages - 3) {
      buttons.push(renderPageButton(1, 1, page === 1))
      buttons.push(renderEllipsis("ellipsis-end"))
      buttons.push(
        ...arrayRange(totalPages - 4, totalPages).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
      return buttons
    }

    buttons.push(renderPageButton(1, 1, page === 1))
    buttons.push(renderEllipsis("ellipsis-middle-left"))
    buttons.push(
      ...arrayRange(page - 1, page + 1).map((pageNumber) =>
        renderPageButton(pageNumber, pageNumber, pageNumber === page)
      )
    )
    buttons.push(renderEllipsis("ellipsis-middle-right"))
    buttons.push(renderPageButton(totalPages, totalPages, totalPages === page))

    return buttons
  }

  return (
    <div className="mt-12 flex w-full justify-center">
      <div className="flex items-center gap-2" data-testid={dataTestid}>
        {renderPageButtons()}
      </div>
    </div>
  )
}
