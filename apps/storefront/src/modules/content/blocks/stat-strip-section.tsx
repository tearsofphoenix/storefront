import { PayloadStatStripBlock } from "types/payload"

export const StatStripSection = ({
  eyebrow,
  items,
  title,
}: PayloadStatStripBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="content-container py-10 small:py-12">
      <div className="bg-[#1c1b19] px-6 py-8 text-white small:px-8">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-white small:text-3xl">
            {title}
          </h2>
        ) : null}
        <div className="mt-6 grid gap-4 small:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.id || `${item.value}-${index}`}
              className="bg-white/5 px-5 py-5"
            >
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-white/80">
                {item.label}
              </p>
              {item.description ? (
                <p className="mt-2 text-sm leading-6 text-white/56">
                  {item.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
