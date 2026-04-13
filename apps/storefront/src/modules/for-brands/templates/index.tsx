import { listStorefrontThemePresets, type StorefrontThemePreset } from "@lib/util/theme-presets"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const contactEmail = "support@pandacat.ai"

const offers = [
  {
    title: "Launch a Medusa storefront in 7 days",
    description:
      "A fast launch package for brands that need a polished storefront, CMS-backed landing pages, and a production-ready commerce flow without rebuilding everything from scratch.",
    deliverables: [
      "Web storefront setup and deployment",
      "Payload CMS integration",
      "Branded landing page and product detail page system",
      "Auth, cart, checkout, and storefront configuration",
    ],
    ctaLabel: "Start a launch sprint",
    ctaSubject: "Storefront launch sprint inquiry",
  },
  {
    title: "Premium theme pack and brand customization",
    description:
      "Use the open-source core as the engine, then ship a higher-converting storefront with a theme that matches your market instead of looking like a generic starter.",
    deliverables: [
      "Premium theme installation",
      "Visual customization for your category",
      "CMS block styling and homepage polish",
      "Optional ongoing iteration after launch",
    ],
    ctaLabel: "Request a theme package",
    ctaSubject: "Premium storefront theme package inquiry",
  },
  {
    title: "AI commerce assistant add-on",
    description:
      "Add a product-aware pre-sales assistant for FAQ handling, guided discovery, and multilingual support without turning the storefront into a support bottleneck.",
    deliverables: [
      "FAQ assistant setup",
      "Product-aware answers on PDPs",
      "Multilingual pre-sales flows",
      "Customer-service escalation path",
    ],
    ctaLabel: "Ask about the AI add-on",
    ctaSubject: "AI commerce assistant inquiry",
  },
] as const

const featuredThemeKeys = ["electronics-pro", "motion"] as const

const launchThemes = featuredThemeKeys
  .map((key) => listStorefrontThemePresets().find((preset) => preset.key === key))
  .filter(Boolean) as StorefrontThemePreset[]

const executionSteps = [
  {
    title: "Days 1-2",
    description:
      "Lock the theme, ICP, and package scope so the storefront is being sold as an outcome, not as source code.",
  },
  {
    title: "Days 3-6",
    description:
      "Prepare storefront styling, branded PDP blocks, and the exact launch path that the buyer will see in demo form.",
  },
  {
    title: "Days 7-10",
    description:
      "Finalize integration details, add the right theme and CMS polish, and align the buyer-specific delivery scope.",
  },
  {
    title: "Days 11-14",
    description:
      "Deliver the production storefront, hand over the CMS workflow, and turn the first launch into a repeatable package.",
  },
] as const

const buildMailtoHref = (subject: string) => {
  const query = new URLSearchParams({
    subject,
  })

  return `mailto:${contactEmail}?${query.toString()}`
}

const sectionClassName =
  "rounded-[32px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] small:p-8"

export default function ForBrandsTemplate() {
  return (
    <div className="bg-[var(--pi-shell-bg)] text-[var(--pi-text)]">
      <div className="content-container flex flex-col gap-8 py-10 small:py-14">
        <section className="rounded-[36px] border border-[var(--pi-border)] bg-[var(--pi-bg)] px-6 py-8 small:px-10 small:py-12">
          <div className="max-w-4xl space-y-5">
            <span className="inline-flex rounded-full border border-[var(--pi-border)] bg-[var(--pi-surface)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--pi-muted-soft)]">
              Open-source core, paid outcomes
            </span>
            <div className="space-y-4">
              <h1
                className="text-4xl font-semibold tracking-[-0.04em] small:text-6xl"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                Launch a better Medusa storefront without starting from zero
              </h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--pi-muted)] small:text-lg">
                This storefront is open-source by design. The commercial value is in
                packaging, theme quality, CMS integration, deployment speed, and AI
                support flows that help brands launch faster.
              </p>
            </div>
            <div className="flex flex-col gap-3 small:flex-row">
              <a
                href={buildMailtoHref("Storefront launch sprint inquiry")}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-colors"
                style={{ background: "var(--pi-primary)" }}
              >
                Book a launch sprint
              </a>
              <LocalizedClientLink
                href="/customer-service"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--pi-border)] px-6 text-sm font-semibold text-[var(--pi-text)]"
              >
                Talk to Panda Commerce
              </LocalizedClientLink>
            </div>
          </div>
        </section>

        <section id="offers" className={sectionClassName}>
          <div className="flex flex-col gap-3 pb-6 small:flex-row small:items-end small:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                Launch offers
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.04em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                Three ways to monetize the storefront now
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--pi-muted)]">
              Do not sell the repo. Sell the launch package, the premium theme, and the
              AI support layer built on top of it.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {offers.map((offer) => (
              <article
                key={offer.title}
                className="flex h-full flex-col rounded-[28px] border border-[var(--pi-border)] bg-[var(--pi-bg)] p-6"
              >
                <div className="space-y-3">
                  <h3
                    className="text-2xl font-semibold tracking-[-0.03em]"
                    style={{ fontFamily: "var(--pi-heading-font)" }}
                  >
                    {offer.title}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--pi-muted)]">
                    {offer.description}
                  </p>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm leading-6 text-[var(--pi-text)]">
                  {offer.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex gap-3">
                      <span
                        className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: "var(--pi-primary)" }}
                      />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={buildMailtoHref(offer.ctaSubject)}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--pi-border)] px-5 text-sm font-semibold text-[var(--pi-text)]"
                >
                  {offer.ctaLabel}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="themes" className={sectionClassName}>
          <div className="flex flex-col gap-3 pb-6 small:flex-row small:items-end small:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                First launch themes
              </p>
              <h2
                className="text-3xl font-semibold tracking-[-0.04em]"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                Start with the two themes that are easiest to sell
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--pi-muted)]">
              Electronics Pro fits hardware, gadgets, and device commerce. Motion fits
              story-led brands that need editorial product pages and strong content-driven
              conversion.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {launchThemes.map((theme) => (
              <article
                key={theme.key}
                className="rounded-[28px] border border-[var(--pi-border)] bg-[var(--pi-bg)] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pi-muted-soft)]">
                      {theme.tier.replaceAll("-", " ")}
                    </p>
                    <h3
                      className="text-2xl font-semibold tracking-[-0.03em]"
                      style={{ fontFamily: theme.headingFontFamily }}
                    >
                      {theme.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-white/40"
                      style={{ background: theme.primaryColor }}
                      aria-hidden="true"
                    />
                    <span
                      className="h-4 w-4 rounded-full border border-[var(--pi-border)]"
                      style={{ background: theme.accentColor }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--pi-muted)]">
                  {theme.summary}
                </p>
                <div className="mt-5 grid gap-3 rounded-[22px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-4 text-sm text-[var(--pi-muted)] small:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                      Best for
                    </p>
                    <p className="mt-2 leading-6">
                      {theme.key === "electronics-pro"
                        ? "Device brands, gadgets, accessories, and B2C/B2B hybrid stores"
                        : "Lifestyle brands, premium storytelling, and long-form marketing PDPs"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                      Monetization angle
                    </p>
                    <p className="mt-2 leading-6">
                      {theme.key === "electronics-pro"
                        ? "Use as a paid theme pack or the front-end layer for Panda’s own hardware and e-paper commerce lane"
                        : "Sell as a premium content-commerce theme with CMS storytelling blocks and brand customization"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="delivery" className={sectionClassName}>
          <div className="space-y-2 pb-6">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
              Delivery plan
            </p>
            <h2
              className="text-3xl font-semibold tracking-[-0.04em]"
              style={{ fontFamily: "var(--pi-heading-font)" }}
            >
              A launch plan that leads to revenue instead of endless polishing
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {executionSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[24px] border border-[var(--pi-border)] bg-[var(--pi-bg)] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pi-muted-soft)]">
                  Step {index + 1}
                </p>
                <h3
                  className="mt-3 text-xl font-semibold tracking-[-0.03em]"
                  style={{ fontFamily: "var(--pi-heading-font)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--pi-muted)]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-[var(--pi-border)] bg-[var(--pi-primary)] px-6 py-8 text-white small:px-10 small:py-10">
          <div className="flex flex-col gap-5 small:flex-row small:items-end small:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Final recommendation
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] small:text-4xl">
                Keep the storefront open. Monetize speed, themes, deployment, and AI upgrades.
              </h2>
              <p className="text-sm leading-7 text-white/80 small:text-base">
                If cash is urgent, use this repo to close launch projects and premium theme work.
                The open-source code is the acquisition layer. The money is in delivery.
              </p>
            </div>
            <div className="flex flex-col gap-3 small:items-end">
              <a
                href={buildMailtoHref("Storefront paid launch inquiry")}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[var(--pi-primary)]"
              >
                Email Panda Commerce
              </a>
              <p className="text-sm text-white/80">support@pandacat.ai</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
