import { PayloadFaqGroupsBlock } from "types/payload"

export const FaqGroupsSection = ({
  description,
  groups,
  title,
}: PayloadFaqGroupsBlock) => {
  if (!groups?.length) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16">
      <div className="mx-auto max-w-4xl">
        {title ? (
          <h2 className="text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-[#4b5563]">
            {description}
          </p>
        ) : null}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {groups.map((group, groupIndex) => (
            <section
              key={group.id || `${group.title}-${groupIndex}`}
              className="bg-[#f4ede2] p-5"
            >
              <h3 className="text-xl font-semibold text-[#111827]">
                {group.title}
              </h3>
              {group.description ? (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#4b5563]">
                  {group.description}
                </p>
              ) : null}
              <div className="mt-4 space-y-3">
                {group.items?.map((item, itemIndex) => (
                  <details
                    key={item.id || `${item.question}-${itemIndex}`}
                    className="bg-[#faf6ee] p-4"
                  >
                    <summary className="cursor-pointer list-none text-sm font-semibold text-[#111827]">
                      {item.question}
                    </summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#4b5563]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
