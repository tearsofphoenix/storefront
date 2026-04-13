import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"

const contactEmail = "support@pandacat.ai"

const inquiryOptions = [
  {
    title: "Order support",
    description:
      "Questions about an order, delivery timing, returns, or account updates.",
    subject: "Order support request",
  },
  {
    title: "Store launch project",
    description:
      "Need a Medusa storefront, premium theme, CMS integration, or launch sprint.",
    subject: "Storefront launch sprint inquiry",
  },
  {
    title: "AI commerce assistant",
    description:
      "Ask about FAQ automation, product-aware support, and multilingual pre-sales help.",
    subject: "AI commerce assistant inquiry",
  },
] as const

const buildMailtoHref = (subject: string) => {
  const query = new URLSearchParams({
    subject,
  })

  return `mailto:${contactEmail}?${query.toString()}`
}

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.common.customerServiceTitle,
    description: "Contact Panda Commerce for order support or storefront launch inquiries.",
  }
}

export default async function CustomerServicePage() {
  const { messages } = await getI18n()

  return (
    <div className="bg-[var(--pi-shell-bg)] text-[var(--pi-text)]">
      <div className="content-container mx-auto flex max-w-5xl flex-col gap-6 py-10 small:py-14">
        <section className="rounded-[36px] border border-[var(--pi-border)] bg-[var(--pi-bg)] px-6 py-8 small:px-10 small:py-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-[var(--pi-border)] bg-[var(--pi-surface)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--pi-muted-soft)]">
              {messages.common.customerServiceTitle}
            </span>
            <h1
              className="text-4xl font-semibold tracking-[-0.04em] small:text-5xl"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              Contact Panda Commerce
            </h1>
            <p className="text-base leading-7 text-[var(--pi-muted)] small:text-lg">
              Use this page for order support, storefront launch projects, premium theme
              work, or AI commerce assistant setup. The fastest path is email.
            </p>
            <div className="flex flex-col gap-3 small:flex-row">
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white"
                style={{ background: "var(--pi-primary)" }}
              >
                Email support@pandacat.ai
              </a>
              <p className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--pi-border)] px-6 text-sm text-[var(--pi-muted)]">
                Response target: within 1 business day
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {inquiryOptions.map((option) => (
            <article
              key={option.title}
              className="flex h-full flex-col rounded-[28px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6"
            >
              <div className="space-y-3">
                <h2
                  className="text-2xl font-semibold tracking-[-0.03em]"
                  style={{ fontFamily: "var(--pi-heading-font)" }}
                >
                  {option.title}
                </h2>
                <p className="text-sm leading-6 text-[var(--pi-muted)]">
                  {option.description}
                </p>
              </div>
              <a
                href={buildMailtoHref(option.subject)}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--pi-border)] bg-[var(--pi-bg)] px-5 text-sm font-semibold text-[var(--pi-text)]"
              >
                Start this conversation
              </a>
            </article>
          ))}
        </section>

        <section className="rounded-[32px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6 small:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-3">
              <h2
                className="text-3xl font-semibold tracking-[-0.04em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                What to include in your email
              </h2>
              <ul className="space-y-3 text-sm leading-6 text-[var(--pi-muted)]">
                <li>• your store or brand name</li>
                <li>• whether you need a launch, a theme package, or an AI add-on</li>
                <li>• your target launch window</li>
                <li>• your current platform, if you already have one</li>
              </ul>
            </div>
            <div className="rounded-[24px] border border-[var(--pi-border)] bg-[var(--pi-bg)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                Fastest commercial route
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--pi-text)]">
                If you need a production storefront quickly, ask for the 7-day launch sprint.
                If you already have Medusa, ask for the premium theme package first.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
