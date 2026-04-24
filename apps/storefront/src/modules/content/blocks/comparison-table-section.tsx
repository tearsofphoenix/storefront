import { getI18n } from "@lib/i18n/server"
import { PayloadComparisonTableBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const ComparisonTableSection = async ({
  description,
  eyebrow,
  leftColumnLabel,
  rightColumnLabel,
  rows,
  title,
}: PayloadComparisonTableBlock) => {
  const { messages } = await getI18n()

  if (!rows?.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className={`${sectionStyles.surface} overflow-hidden`}>
        <div className={`${sectionStyles.insetTight} border-b border-black/10`}>
          {eyebrow ? (
            <p className={sectionStyles.eyebrow}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={`mt-1.5 ${sectionStyles.title}`}>
            {title}
          </h2>
          {description ? (
            <p className={`mt-3 max-w-3xl whitespace-pre-line ${sectionStyles.bodyLarge}`}>
              {description}
            </p>
          ) : null}
        </div>
        <div className={`grid grid-cols-[minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(140px,1fr)] border-b border-black/10 bg-[#f1eee8] px-6 py-4 ${sectionStyles.label} text-[#111111] small:px-8`}>
          <div>{messages.common.feature}</div>
          <div>{leftColumnLabel}</div>
          <div>{rightColumnLabel}</div>
        </div>
        <div className="divide-y divide-black/10">
          {rows.map((row, index) => (
            <div
              key={row.id || `${row.feature}-${index}`}
              className="grid grid-cols-[minmax(160px,1.1fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-2 px-6 py-4 small:px-8"
            >
              <div className={sectionStyles.bodySmall}>{row.feature}</div>
              <div
                className={`${sectionStyles.bodySmall} ${
                  row.emphasis === "left"
                    ? "font-semibold text-[#111111]"
                    : "text-[#4b4b4b]"
                }`}
              >
                {row.leftValue}
              </div>
              <div
                className={`${sectionStyles.bodySmall} ${
                  row.emphasis === "right"
                    ? "font-semibold text-[#111111]"
                    : "text-[#4b4b4b]"
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
