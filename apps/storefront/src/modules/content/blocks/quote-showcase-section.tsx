import { getPayloadMediaUrl } from "@lib/payload/client"
import { PayloadQuoteShowcaseBlock } from "types/payload"

export const QuoteShowcaseSection = ({
  author,
  avatar,
  eyebrow,
  highlight,
  quote,
  role,
}: PayloadQuoteShowcaseBlock) => {
  const avatarUrl = getPayloadMediaUrl(avatar?.url)

  return (
    <section className="content-container py-12 small:py-16">
      <div className="rounded-[2rem] bg-[#181818] px-6 py-10 text-white small:px-10 small:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              {eyebrow}
            </p>
          ) : null}
          <blockquote className="text-3xl font-semibold leading-tight small:text-4xl">
            “{quote}”
          </blockquote>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  alt={avatar?.alt || author}
                  className="h-14 w-14 rounded-full object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/70">
                  {author.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-white">{author}</p>
                {role ? (
                  <p className="text-sm text-white/64">{role}</p>
                ) : null}
              </div>
            </div>
            {highlight ? (
              <div className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
                {highlight}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
