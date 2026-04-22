import { PayloadStatStripBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const StatStripSection = ({
  eyebrow,
  items,
  title,
}: PayloadStatStripBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className={sectionStyles.sectionCompact}>
      <div className={`${sectionStyles.surfaceDark} ${sectionStyles.insetTight}`}>
        {eyebrow ? (
          <p className={sectionStyles.eyebrowOnDark}>
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className={`mt-1.5 ${sectionStyles.titleOnDark}`}>
            {title}
          </h2>
        ) : null}
        <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} small:grid-cols-2 xl:grid-cols-4`}>
          {items.map((item, index) => (
            <article
              key={item.id || `${item.value}-${index}`}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 small:p-6"
            >
              <p className={sectionStyles.displayTitleOnDark}>{item.value}</p>
              <p className={`mt-2 ${sectionStyles.label} text-white/80`}>
                {item.label}
              </p>
              {item.description ? (
                <p className={`mt-2 ${sectionStyles.bodySmallOnDark}`}>
                  {item.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
