import { PayloadFaqBlock } from "types/payload"

export const FAQSection = ({ items, title }: PayloadFaqBlock) => {
  if (!items?.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="mx-auto max-w-3xl">
        {title ? (
          <h2 className="text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
        ) : null}
        <div className="mt-8 space-y-4">
          {items.map((item, index) => (
            <details
              key={item.id || `${item.question}-${index}`}
              className="group rounded-[1.5rem] border border-[#e5e7eb] bg-white p-5 open:border-[#cbd5e1]"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-[#111827]">
                {item.question}
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#4b5563]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
