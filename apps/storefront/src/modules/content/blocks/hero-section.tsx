import { getPayloadMediaUrl } from "@lib/payload/client"
import { PayloadHeroBlock } from "types/payload"

import { CmsLink } from "./cms-link"

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
    <section className="bg-[#f3ecdf]">
      <div className="content-container grid gap-10 py-14 small:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] small:items-center small:py-20">
        <div className="flex max-w-xl flex-col gap-5">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-4xl font-semibold leading-tight text-[#111827] small:text-5xl">
            {headline}
          </h2>
          {subheadline ? (
            <p className="whitespace-pre-line text-base leading-7 text-[#4b5563] small:text-lg">
              {subheadline}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {primaryCTA?.label && primaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
                href={primaryCTA.href}
              >
                {primaryCTA.label}
              </CmsLink>
            ) : null}
            {secondaryCTA?.label && secondaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-medium text-[#111827] transition-colors hover:border-black/40"
                href={secondaryCTA.href}
              >
                {secondaryCTA.label}
              </CmsLink>
            ) : null}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-[#e6dcc9]">
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
            <img
              alt={backgroundImage?.alt || headline}
              className="aspect-[4/3] w-full object-cover"
              src={imageUrl}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#e7dcc8,#f5efe3)] text-sm text-[#6b7280]">
              Payload Hero Media
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
