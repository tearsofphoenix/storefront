import { PayloadSectionNavBlock } from "types/payload"
import { sectionStyles } from "./section-styles"

export const SectionNav = ({ items, title }: PayloadSectionNavBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="sticky top-16 z-20 border-b border-black/10 bg-white/92 backdrop-blur">
      <div className="content-container flex flex-col gap-3 py-4 small:flex-row small:items-center small:justify-between">
        {title ? (
          <p className={sectionStyles.eyebrow}>
            {title}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <a
              key={item.id || `${item.anchorId}-${index}`}
              className={`inline-flex items-center rounded-[12.5px] border border-black/15 bg-[#f7f7f7] px-4 py-2 ${sectionStyles.label} text-[#111111] transition-colors hover:bg-[#ececec]`}
              href={`#${item.anchorId}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
