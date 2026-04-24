import { PayloadBenefitStripBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const BenefitStripSection = ({
  description,
  items,
  title,
}: PayloadBenefitStripBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className={sectionStyles.sectionCompact}>
      <div className={`${sectionStyles.surface} ${sectionStyles.insetTight}`}>
        {title ? (
          <h2 className="text-2xl font-semibold leading-tight text-[#111111] small:text-3xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className={`mt-3 max-w-3xl whitespace-pre-line ${sectionStyles.body}`}>
            {description}
          </p>
        ) : null}
        <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} small:grid-cols-2 xl:grid-cols-4`}>
          {items.map((item, index) => (
            <article
              key={item.id || `${item.title}-${index}`}
              className={`${sectionStyles.cardSoft} ${sectionStyles.cardPadding}`}
            >
              <h3 className={sectionStyles.cardTitle}>
                {item.title}
              </h3>
              {item.description ? (
                <p className={`mt-2 whitespace-pre-line ${sectionStyles.bodySmall}`}>
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
