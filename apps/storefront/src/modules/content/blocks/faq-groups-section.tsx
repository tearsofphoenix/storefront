import { PayloadFaqGroupsBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const FaqGroupsSection = ({
  description,
  groups,
  title,
}: PayloadFaqGroupsBlock) => {
  if (!groups?.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className="mx-auto max-w-4xl">
        {title ? (
          <h2 className={sectionStyles.title}>
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className={`mt-4 max-w-3xl whitespace-pre-line ${sectionStyles.body}`}>
            {description}
          </p>
        ) : null}
        <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} lg:grid-cols-2`}>
          {groups.map((group, groupIndex) => (
            <section
              key={group.id || `${group.title}-${groupIndex}`}
              className={`${sectionStyles.cardSoft} ${sectionStyles.cardPadding}`}
            >
              <h3 className={sectionStyles.subTitle}>
                {group.title}
              </h3>
              {group.description ? (
                <p className={`mt-2 whitespace-pre-line ${sectionStyles.bodySmall}`}>
                  {group.description}
                </p>
              ) : null}
              <div className="mt-4 space-y-2.5">
                {group.items?.map((item, itemIndex) => (
                  <details
                    key={item.id || `${item.question}-${itemIndex}`}
                    className={`${sectionStyles.card} p-4 small:p-5`}
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
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
