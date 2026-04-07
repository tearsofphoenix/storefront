import { PayloadSpecTableBlock } from "types/payload"

export const SpecTableSection = ({ rows, title }: PayloadSpecTableBlock) => {
  if (!rows?.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#e5e7eb] bg-white">
        {title ? (
          <div className="border-b border-[#e5e7eb] px-6 py-5 small:px-8">
            <h2 className="text-2xl font-semibold text-[#111827]">{title}</h2>
          </div>
        ) : null}
        <div className="divide-y divide-[#e5e7eb]">
          {rows.map((row, index) => (
            <div
              key={row.id || `${row.label}-${index}`}
              className="grid gap-2 px-6 py-4 small:grid-cols-[220px_minmax(0,1fr)] small:px-8"
            >
              <dt className="text-sm font-medium text-[#6b7280]">{row.label}</dt>
              <dd className="text-sm leading-6 text-[#111827]">{row.value}</dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
