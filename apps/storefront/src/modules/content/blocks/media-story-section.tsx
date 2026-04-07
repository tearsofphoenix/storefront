import { getPayloadMediaUrl } from "@lib/payload/client"
import { PayloadMediaStoryBlock } from "types/payload"

export const MediaStorySection = ({
  body,
  eyebrow,
  media,
  mediaPosition,
  title,
}: PayloadMediaStoryBlock) => {
  const imageUrl = getPayloadMediaUrl(media?.url)
  const isImageFirst = mediaPosition === "left"

  return (
    <section className="content-container py-12 small:py-16">
      <div
        className={`grid gap-8 rounded-[2rem] bg-[#f8fafc] p-6 small:p-10 lg:grid-cols-2 lg:items-center ${
          isImageFirst ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <div className="overflow-hidden rounded-[1.5rem] bg-white">
          {imageUrl ? (
            <img
              alt={media?.alt || title}
              className="h-full w-full object-cover"
              src={imageUrl}
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#f8fafc)] text-sm text-[#6b7280]">
              Payload Story Media
            </div>
          )}
        </div>
        <div className="flex max-w-xl flex-col gap-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-3xl font-semibold leading-tight text-[#111827] small:text-4xl">
            {title}
          </h2>
          <p className="whitespace-pre-line text-base leading-7 text-[#4b5563]">
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}
