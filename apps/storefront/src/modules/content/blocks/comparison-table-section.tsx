import { PayloadComparisonTableBlock } from "types/payload"

export const ComparisonTableSection = ({
  description,
  eyebrow,
  leftColumnLabel,
  rightColumnLabel,
  rows,
  title,
}: PayloadComparisonTableBlock) => {
  if (!rows?.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="overflow-hidden bg-[#f7f2e8]">
        <div className="border-b border-black/8 px-6 py-6 small:px-8">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-[#4b5563]">
              {description}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-[minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(140px,1fr)] border-b border-black/8 bg-[#efe7d8] px-6 py-4 text-sm font-semibold text-[#111827] small:px-8">
          <div>Feature</div>
          <div>{leftColumnLabel}</div>
          <div>{rightColumnLabel}</div>
        </div>
        <div className="divide-y divide-black/8">
          {rows.map((row, index) => (
            <div
              key={row.id || `${row.feature}-${index}`}
              className="grid grid-cols-[minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-3 px-6 py-4 small:px-8"
            >
              <div className="text-sm font-medium text-[#111827]">{row.feature}</div>
              <div
                className={`text-sm leading-6 ${
                  row.emphasis === "left"
                    ? "font-semibold text-[#111827]"
                    : "text-[#4b5563]"
                }`}
              >
                {row.leftValue}
              </div>
              <div
                className={`text-sm leading-6 ${
                  row.emphasis === "right"
                    ? "font-semibold text-[#111827]"
                    : "text-[#4b5563]"
                }`}
              >
                {row.rightValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
