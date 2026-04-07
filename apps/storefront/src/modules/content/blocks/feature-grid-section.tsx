import { getPayloadMediaUrl } from "@lib/payload/client"
import { PayloadFeatureGridBlock } from "types/payload"

export const FeatureGridSection = ({
  description,
  items,
  title,
}: PayloadFeatureGridBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="mx-auto max-w-3xl text-center">
        {title ? (
          <h2 className="text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#4b5563]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-10 grid gap-5 small:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const imageUrl = getPayloadMediaUrl(item.image?.url)

          return (
            <article
              key={item.id || `${item.title}-${index}`}
              className="overflow-hidden rounded-[1.75rem] border border-[#e5e7eb] bg-white shadow-[0_12px_48px_rgba(15,23,42,0.05)]"
            >
              {imageUrl ? (
                <img
                  alt={item.image?.alt || item.title}
                  className="aspect-[4/3] w-full object-cover"
                  src={imageUrl}
                />
              ) : null}
              <div className="flex flex-col gap-3 p-6">
                <h3 className="text-xl font-semibold text-[#111827]">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="whitespace-pre-line text-sm leading-6 text-[#4b5563]">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
