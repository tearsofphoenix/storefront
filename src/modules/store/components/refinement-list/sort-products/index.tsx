"use client"

import NativeSelect from "@modules/common/components/native-select"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey-50">
        Sort by
      </span>
      <NativeSelect
        data-testid={dataTestId}
        value={sortBy}
        onChange={(event) => handleChange(event.target.value)}
        className="min-w-[220px] border-[#d9dfe8] bg-white text-sm text-grey-80 hover:bg-white"
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
