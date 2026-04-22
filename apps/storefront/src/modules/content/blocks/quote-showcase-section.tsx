import { getPayloadMediaUrl } from "@lib/payload/client"
import Image from "next/image"
import { PayloadQuoteShowcaseBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const QuoteShowcaseSection = ({
  author,
  avatar,
  eyebrow,
  highlight,
  quote,
  role,
}: PayloadQuoteShowcaseBlock) => {
  const avatarUrl = getPayloadMediaUrl(avatar?.url)

  return (
    <section className={sectionStyles.section}>
      <div className={`${sectionStyles.surfaceDark} ${sectionStyles.inset}`}>
        <div className={`${sectionStyles.stackLg} mx-auto max-w-4xl`}>
          {eyebrow ? (
            <p className={sectionStyles.eyebrowOnDark}>
              {eyebrow}
            </p>
          ) : null}
          <blockquote className={sectionStyles.displayTitleOnDark}>
            “{quote}”
          </blockquote>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/20">
                  <Image
                    alt={avatar?.alt || author}
                    className="object-cover"
                    fill
                    sizes="56px"
                    src={avatarUrl}
                  />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white/70">
                  {author.slice(0, 1)}
                </div>
              )}
              <div>
                <p className={sectionStyles.cardTitle.replace("text-[#111111]", "text-white")}>
                  {author}
                </p>
                {role ? (
                  <p className={sectionStyles.bodySmallOnDark}>{role}</p>
                ) : null}
              </div>
            </div>
            {highlight ? (
              <div className={`rounded-full border border-white/20 bg-white/8 px-4 py-2 ${sectionStyles.label} text-white/80`}>
                {highlight}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
