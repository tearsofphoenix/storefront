import { PayloadSpecTableBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const SpecTableSection = ({ rows, title }: PayloadSpecTableBlock) => {
  if (!rows?.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className={`${sectionStyles.surface} overflow-hidden`}>
        {title ? (
          <div className="border-b border-black/10 px-6 py-5 small:px-8">
            <h2 className={sectionStyles.subTitle}>{title}</h2>
          </div>
        ) : null}
        <div className="divide-y divide-black/10">
          {rows.map((row, index) => (
            <div
              key={row.id || `${row.label}-${index}`}
              className="grid gap-2 px-6 py-4 small:grid-cols-[220px_minmax(0,1fr)] small:px-8"
            >
              <dt className={sectionStyles.caption}>{row.label}</dt>
              <dd className={sectionStyles.bodySmall}>{row.value}</dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
