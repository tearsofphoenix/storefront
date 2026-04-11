"use client"

import { useEffect, useMemo, useState } from "react"

import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"

type ImpulseHeroSlide = {
  id: string
  title: string
  handle: string | null
  image: string | null
}

type ImpulseHeroProps = {
  eyebrow: string
  heading: string
  subheading: string
  ctaLabel: string
  ctaHref: string
  secondaryLabel: string
  secondaryHref: string
  slides: ImpulseHeroSlide[]
}

export default function ImpulseHero({
  eyebrow,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  slides,
}: ImpulseHeroProps) {
  const resolvedSlides = useMemo(
    () => slides.filter((slide) => Boolean(slide.image)).slice(0, 4),
    [slides]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (resolvedSlides.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % resolvedSlides.length)
    }, 4200)

    return () => {
      window.clearInterval(timer)
    }
  }, [resolvedSlides.length])

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / 620, 1)
      setScrollProgress(progress)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const activeSlide = resolvedSlides[activeIndex] || null

  return (
    <section
      className="relative isolate overflow-hidden border-y"
      style={{
        borderColor: "var(--pi-border)",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#fff_0%,#fff6f3_35%,#ffe9e2_100%)]" />
      {activeSlide?.image ? (
        <div
          className="absolute right-0 top-0 h-full w-full small:w-[60%]"
          style={{
            transform: `translateY(-${Math.round(scrollProgress * 30)}%)`,
          }}
        >
          <Image
            src={activeSlide.image}
            alt={activeSlide.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center opacity-[0.28]"
            unoptimized={shouldUnoptimizeImage(activeSlide.image)}
          />
        </div>
      ) : null}

      <div className="content-container relative z-[1] grid min-h-[78dvh] items-center gap-12 py-14 small:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] small:py-20">
        <div className="grid gap-6">
          <span
            className="inline-flex w-fit items-center rounded-[2px] border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              borderColor: "rgba(232,40,58,0.35)",
              background: "rgba(232,40,58,0.08)",
              color: "#a91a2d",
            }}
          >
            {eyebrow}
          </span>

          <h1
            className="max-w-[12ch] text-[clamp(2.6rem,6.4vw,5.3rem)] leading-[0.95]"
            style={{
              fontFamily: "var(--pi-heading-font)",
              color: "var(--pi-text)",
            }}
          >
            {heading}
          </h1>
          <p className="max-w-[34rem] text-base leading-7 text-[var(--pi-muted)] small:text-lg">
            {subheading}
          </p>

          <div className="flex flex-wrap gap-3">
            <LocalizedClientLink
              href={ctaHref}
              className="theme-solid-button !rounded-[2px] !border-[#e8283a] !bg-[#e8283a]"
            >
              {ctaLabel}
            </LocalizedClientLink>
            <LocalizedClientLink
              href={secondaryHref}
              className="theme-outline-button !rounded-[2px] !border-[var(--pi-border-strong)]"
            >
              {secondaryLabel}
            </LocalizedClientLink>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {resolvedSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: activeIndex === index ? "2.1rem" : "0.85rem",
                  background:
                    activeIndex === index
                      ? "var(--pi-primary)"
                      : "rgba(28, 28, 28, 0.25)",
                }}
              >
                <span className="sr-only">{slide.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 small:justify-end">
          <div
            className="relative aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[6px] border bg-white"
            style={{ borderColor: "var(--pi-border)" }}
          >
            {activeSlide?.image ? (
              <Image
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover object-center"
                unoptimized={shouldUnoptimizeImage(activeSlide.image)}
              />
            ) : null}
          </div>
          {activeSlide?.handle ? (
            <LocalizedClientLink
              href={`/products/${activeSlide.handle}`}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium uppercase tracking-[0.13em] text-[var(--pi-primary)]"
            >
              Quick view: {activeSlide.title}
            </LocalizedClientLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}
