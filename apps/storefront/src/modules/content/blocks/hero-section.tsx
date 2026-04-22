import { getPayloadMediaUrl } from "@lib/payload/client"
import Image from "next/image"
import { PayloadHeroBlock } from "types/payload"

import { CmsLink } from "./cms-link"
import { sectionStyles } from "./section-styles"

export const HeroSection = ({
  backgroundImage,
  backgroundVideo,
  eyebrow,
  headline,
  mediaType,
  primaryCTA,
  secondaryCTA,
  subheadline,
}: PayloadHeroBlock) => {
  const imageUrl = getPayloadMediaUrl(backgroundImage?.url)
  const videoUrl = getPayloadMediaUrl(backgroundVideo?.url)

  return (
    <section className={sectionStyles.heroSection}>
      <div
        className={`grid ${sectionStyles.sectionGridGap} ${sectionStyles.surface} ${sectionStyles.inset} small:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] small:items-center`}
      >
        <div className={`${sectionStyles.stackLg} max-w-xl`}>
          {eyebrow ? (
            <p className={sectionStyles.eyebrow}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={sectionStyles.displayTitle}>
            {headline}
          </h2>
          {subheadline ? (
            <p className={`whitespace-pre-line ${sectionStyles.bodyLarge}`}>
              {subheadline}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-1">
            {primaryCTA?.label && primaryCTA.href ? (
              <CmsLink
                className={sectionStyles.primaryButton}
                href={primaryCTA.href}
              >
                {primaryCTA.label}
              </CmsLink>
            ) : null}
            {secondaryCTA?.label && secondaryCTA.href ? (
              <CmsLink
                className={sectionStyles.secondaryButton}
                href={secondaryCTA.href}
              >
                {secondaryCTA.label}
              </CmsLink>
            ) : null}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-black/12 bg-[#f3f3f3]">
          {mediaType === "video" && videoUrl ? (
            <video
              autoPlay
              className="aspect-[4/3] w-full object-cover"
              loop
              muted
              playsInline
            >
              <source src={videoUrl} />
            </video>
          ) : imageUrl ? (
            <div className="relative aspect-[4/3] w-full">
              <Image
                alt={backgroundImage?.alt || headline}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 640px) 52vw, 100vw"
                src={imageUrl}
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#f0f0f0,#fafafa)] text-sm text-[#6f6f6f]">
              Payload Hero Media
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
