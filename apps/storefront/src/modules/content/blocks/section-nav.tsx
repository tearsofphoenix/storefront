import { PayloadSectionNavBlock } from "types/payload"

export const SectionNav = ({ items, title }: PayloadSectionNavBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="sticky top-16 z-20 bg-[#faf7f2]/95 backdrop-blur">
      <div className="content-container flex flex-col gap-3 py-4 small:flex-row small:items-center small:justify-between">
        {title ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
            {title}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <a
              key={item.id || `${item.anchorId}-${index}`}
              className="inline-flex items-center rounded-full bg-[#efe7d8] px-3 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#e6ddcd]"
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
