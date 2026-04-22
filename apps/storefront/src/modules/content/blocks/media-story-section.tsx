import { getPayloadMediaUrl } from "@lib/payload/client"
import Image from "next/image"
import { PayloadMediaStoryBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const MediaStorySection = ({
  body,
  eyebrow,
  media,
  mediaPosition,
  title,
}: PayloadMediaStoryBlock) => {
  const imageUrl = getPayloadMediaUrl(media?.url)
  const isImageFirst = mediaPosition === "left"
  const bodyText = body?.trim()

  return (
    <section className={sectionStyles.section}>
      <div
        className={`grid ${sectionStyles.sectionGridGap} ${sectionStyles.surfaceAlt} ${sectionStyles.inset} lg:grid-cols-2 lg:items-center ${
          isImageFirst ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-black/12 bg-[#f3f3f3]">
          {imageUrl ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                alt={media?.alt || title}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={imageUrl}
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#f0f0f0,#fafafa)] text-sm text-[#6f6f6f]">
              Payload Story Media
            </div>
          )}
        </div>
        <div className={`${sectionStyles.stackLg} max-w-xl`}>
          {eyebrow ? (
            <p className={sectionStyles.eyebrow}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={sectionStyles.title}>
            {title}
          </h2>
          {bodyText ? (
            <p className={`whitespace-pre-line ${sectionStyles.bodyLarge}`}>
              {bodyText}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
