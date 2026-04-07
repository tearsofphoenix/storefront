import { PayloadCtaBlock } from "types/payload"

import { CmsLink } from "./cms-link"

export const CTASection = ({
  description,
  primaryCTA,
  secondaryCTA,
  title,
}: PayloadCtaBlock) => {
  return (
    <section className="content-container py-12 small:py-16">
      <div className="rounded-[2rem] bg-[#111827] px-6 py-10 text-white small:px-10 small:py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4">
          <h2 className="text-3xl font-semibold leading-tight small:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="whitespace-pre-line text-base leading-7 text-white/78">
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            {primaryCTA?.label && primaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[#111827] transition-opacity hover:opacity-85"
                href={primaryCTA.href}
              >
                {primaryCTA.label}
              </CmsLink>
            ) : null}
            {secondaryCTA?.label && secondaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/60"
                href={secondaryCTA.href}
              >
                {secondaryCTA.label}
              </CmsLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
