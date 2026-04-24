import { PayloadCtaBlock } from "types/payload"

import { CmsLink } from "./cms-link"
import { sectionStyles } from "./section-styles"

export const CTASection = ({
  description,
  primaryCTA,
  secondaryCTA,
  title,
}: PayloadCtaBlock) => {
  return (
    <section className={sectionStyles.section}>
      <div className={`${sectionStyles.surfaceDark} ${sectionStyles.inset}`}>
        <div className={`${sectionStyles.stackLg} mx-auto max-w-3xl items-start`}>
          <h2 className={sectionStyles.titleOnDark}>
            {title}
          </h2>
          {description ? (
            <p className={`whitespace-pre-line ${sectionStyles.bodyOnDark}`}>
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-1">
            {primaryCTA?.label && primaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-[12.5px] bg-white px-6 py-3 text-[12.8px] font-medium uppercase tracking-[0.04em] text-[#111111] transition-colors hover:bg-[#f0f0f0]"
                href={primaryCTA.href}
              >
                {primaryCTA.label}
              </CmsLink>
            ) : null}
            {secondaryCTA?.label && secondaryCTA.href ? (
              <CmsLink
                className="inline-flex items-center justify-center rounded-[12.5px] border border-white/25 bg-white/10 px-6 py-3 text-[12.8px] font-medium uppercase tracking-[0.04em] text-white transition-colors hover:bg-white/16"
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
