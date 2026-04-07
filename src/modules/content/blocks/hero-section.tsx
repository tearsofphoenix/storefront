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
    <section className="border-y border-[#e5e7eb] bg-[#f6f2eb]">
      <div className="content-container grid gap-10 py-12 small:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] small:items-center small:py-16">
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
                className="inline-flex items-center justify-center rounded-full border border-[#d1d5db] px-5 py-3 text-sm font-medium text-[#111827] transition-colors hover:border-[#111827]"
                href={secondaryCTA.href}
              >
                {secondaryCTA.label}
              </CmsLink>
            ) : null}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          {mediaType === "video" && videoUrl ? (
            <video
              autoPlay
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
            >
              <source src={videoUrl} />
            </video>
          ) : imageUrl ? (
            <img
              alt={backgroundImage?.alt || headline}
              className="h-full w-full object-cover"
              src={imageUrl}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[radial-gradient(circle_at_top,_#dbeafe,_transparent_55%),linear-gradient(135deg,#f8fafc,#e5e7eb)] text-sm text-[#6b7280]">
              Payload Hero Media
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
