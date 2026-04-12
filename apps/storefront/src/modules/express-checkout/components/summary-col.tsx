"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import { useExpressRegion } from "@providers/express-region"

export const SummaryCol = () => {
  const { region, regions, setRegion } = useExpressRegion()
  const { messages } = useI18n()

  return (
    <div className="flex flex-col justify-center items-center gap-6 lg:w-1/2 w-full">
      <div className="flex justify-center gap-1">
        <span className="text-sm text-ui-fg-muted">{messages.common.region}:</span>
        <select
          value={region?.id}
          onChange={(e) => {
            const selectedRegion = regions.find(
              (r) => r.id === e.target.value
            )
            setRegion(selectedRegion)
          }}
          className="text-sm text-ui-fg-subtle appearance-none border-none bg-transparent pr-4 cursor-pointer"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
