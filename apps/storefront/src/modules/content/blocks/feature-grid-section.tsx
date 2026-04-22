import { getPayloadMediaUrl } from "@lib/payload/client"
import Image from "next/image"
import { PayloadFeatureGridBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const FeatureGridSection = ({
  description,
  items,
  title,
}: PayloadFeatureGridBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className={sectionStyles.section}>
      <div className="mx-auto max-w-3xl text-center">
        {title ? (
          <h2 className={sectionStyles.title}>
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className={`mt-4 whitespace-pre-line ${sectionStyles.body}`}>
            {description}
          </p>
        ) : null}
      </div>
      <div className={`${sectionStyles.sectionTopGap} grid ${sectionStyles.sectionGridGap} small:grid-cols-2 xl:grid-cols-3`}>
        {items.map((item, index) => {
          const imageUrl = getPayloadMediaUrl(item.image?.url)

          return (
            <article
              key={item.id || `${item.title}-${index}`}
              className={`${sectionStyles.cardSoft} overflow-hidden`}
            >
              {imageUrl ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    alt={item.image?.alt || item.title}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={imageUrl}
                  />
                </div>
              ) : null}
              <div className={`${sectionStyles.stackMd} ${sectionStyles.cardPadding}`}>
                <h3 className={sectionStyles.subTitle}>
                  {item.title}
                </h3>
                {item.description ? (
                  <p className={`whitespace-pre-line ${sectionStyles.bodySmall}`}>
                    {item.description}
                  </p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
