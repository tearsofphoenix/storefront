import { PayloadFaqBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const FAQSection = ({ items, title }: PayloadFaqBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className="mx-auto max-w-3xl">
        {title ? (
          <h2 className={sectionStyles.title}>
            {title}
          </h2>
        ) : null}
        <div className={`${sectionStyles.sectionTopGap} space-y-3`}>
          {items.map((item, index) => (
            <details
              key={item.id || `${item.question}-${index}`}
              className={`group ${sectionStyles.cardSoft} ${sectionStyles.cardPadding}`}
            >
              <summary className={`cursor-pointer list-none ${sectionStyles.cardTitle}`}>
                {item.question}
              </summary>
              <p className={`mt-3 whitespace-pre-line ${sectionStyles.bodySmall}`}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
