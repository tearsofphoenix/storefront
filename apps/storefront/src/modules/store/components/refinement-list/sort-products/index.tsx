"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import NativeSelect from "@modules/common/components/native-select"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const { messages } = useI18n()
  const sortOptions = [
    {
      value: "created_at",
      label: messages.store.latestArrivals,
    },
    {
      value: "price_asc",
      label: messages.store.priceLowHigh,
    },
    {
      value: "price_desc",
      label: messages.store.priceHighLow,
    },
  ]

  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50">
        {messages.store.sortBy}
      </span>
      <NativeSelect
        data-testid={dataTestId}
        value={sortBy}
        onChange={(event) => handleChange(event.target.value)}
        className="min-w-[220px] border-[var(--rm-border)] bg-white text-sm text-grey-80 hover:bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </label>
  )
}

export default SortProducts
