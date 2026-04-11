"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MotionHeroProps = {
  eyebrow: string
  heading: string
  subheading: string
  ctaLabel: string
  ctaHref: string
  secondaryLabel: string
  secondaryHref: string
  videoSrc: string
}

export default function MotionHero({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  videoSrc,
}: MotionHeroProps) {
  return (
    <section className="relative isolate min-h-[92dvh] overflow-hidden border-y border-[var(--pi-border)]">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={videoSrc}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="content-container relative z-[1] grid min-h-[92dvh] items-center py-16">
        <div className="grid max-w-[44rem] gap-7">
          <span className="inline-flex w-fit rounded-full border border-white/35 bg-black/28 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            {eyebrow}
          </span>
          <h1
            className="max-w-[12ch] text-[clamp(2.8rem,6.4vw,5.6rem)] leading-[0.94] text-white"
            style={{ fontFamily: "var(--pi-heading-font)" }}
          >
            {heading}
          </h1>
          <p className="max-w-[35rem] text-base leading-7 text-white/85 small:text-lg">
            {subheading}
          </p>
          <div className="flex flex-wrap gap-3">
            <LocalizedClientLink
              href={ctaHref}
              className="theme-solid-button !rounded-full !border-white !bg-white !px-6 !text-black"
            >
              {ctaLabel}
            </LocalizedClientLink>
            <LocalizedClientLink
              href={secondaryHref}
              className="theme-outline-button !rounded-full !border-white/70 !bg-transparent !text-white hover:!border-white hover:!bg-white/10"
            >
              {secondaryLabel}
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}
