import { PayloadBenefitStripBlock } from "types/payload"

export const BenefitStripSection = ({
  description,
  items,
  title,
}: PayloadBenefitStripBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="content-container py-10 small:py-12">
      <div className="bg-[#efe7d8] px-6 py-6 small:px-8">
        {title ? (
          <h2 className="text-2xl font-semibold leading-tight text-[#111827] small:text-3xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-[#4b5563] small:text-base">
            {description}
          </p>
        ) : null}
        <div className="mt-6 grid gap-4 small:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.id || `${item.title}-${index}`}
              className="bg-[#f8f3ea] px-5 py-5"
            >
              <h3 className="text-base font-semibold text-[#111827]">
                {item.title}
              </h3>
              {item.description ? (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#4b5563]">
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
