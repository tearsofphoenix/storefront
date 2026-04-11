"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import Image from "next/image"

import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MotionStoryProduct = {
  id: string
  title: string
  handle: string | null
  image: string | null
}

type MotionStoryProps = {
  products: MotionStoryProduct[]
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

function Counter({ target, inView }: { target: number; inView: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) {
      return
    }

    let raf = 0
    let startedAt: number | null = null
    const duration = 1400

    const tick = (time: number) => {
      if (!startedAt) {
        startedAt = time
      }

      const progress = Math.min((time - startedAt) / duration, 1)
      setValue(Math.round(target * progress))

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick)
      }
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [inView, target])

  return <span>{value}</span>
}

export default function MotionStory({ products }: MotionStoryProps) {
  const storyProducts = useMemo(
    () => products.filter((product) => Boolean(product.image)).slice(0, 3),
    [products]
  )
  const valueSection = useInView<HTMLDivElement>()

  return (
    <section className="content-container grid gap-12 py-16 small:py-20">
      {storyProducts.map((product, index) => (
        <StoryBlock key={product.id} product={product} index={index} />
      ))}

      <div
        ref={valueSection.ref}
        className="grid gap-6 rounded-[6px] border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6 small:grid-cols-3 small:p-8"
      >
        <div className="grid gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white/70">
            Story blocks
          </span>
          <p className="text-4xl leading-none text-white">
            <Counter target={18} inView={valueSection.inView} />+
          </p>
        </div>
        <div className="grid gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white/70">
            Scroll scenes
          </span>
          <p className="text-4xl leading-none text-white">
            <Counter target={42} inView={valueSection.inView} />
          </p>
        </div>
        <div className="grid gap-2">
          <span className="text-[11px] uppercase tracking-[0.16em] text-white/70">
            Avg. watch sec
          </span>
          <p className="text-4xl leading-none text-white">
            <Counter target={96} inView={valueSection.inView} />
          </p>
        </div>
      </div>
    </section>
  )
}

function StoryBlock({
  product,
  index,
}: {
  product: MotionStoryProduct
  index: number
}) {
  const block = useInView<HTMLDivElement>()
  const reverse = index % 2 === 1

  return (
    <article
      ref={block.ref}
      className={`grid items-center gap-6 small:grid-cols-2 ${
        reverse ? "small:[&>*:first-child]:order-2" : ""
      }`}
      style={{
        opacity: block.inView ? 1 : 0,
        transform: block.inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 420ms ease, transform 420ms ease",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-[var(--pi-border)] bg-[var(--pi-surface)]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={shouldUnoptimizeImage(product.image)}
            className="object-cover object-center"
          />
        ) : null}
      </div>
      <div className="grid gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
          Story {index + 1}
        </span>
        <h3 className="text-[2.1rem] leading-[1.04] text-white small:text-[2.6rem]">
          {product.title}
        </h3>
        <p className="max-w-[36rem] text-sm leading-6 text-white/76 small:text-base">
          Crafted visuals and narrative sections tuned for slower, story-led browsing.
        </p>
        {product.handle ? (
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="inline-flex w-fit rounded-full border border-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
          >
            Explore product
          </LocalizedClientLink>
        ) : null}
      </div>
    </article>
  )
}
