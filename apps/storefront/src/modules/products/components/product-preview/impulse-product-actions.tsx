"use client"

import { useEffect, useMemo, useState, useTransition } from "react"

import Image from "next/image"
import { useParams } from "next/navigation"

import { addToCart } from "@lib/data/cart"
import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ImpulseProductActionsProps = {
  productHandle: string
  productTitle: string
  imageUrl: string | null
  priceLabel?: string | null
  defaultVariantId?: string | null
  canDirectBuy: boolean
}

export default function ImpulseProductActions({
  productHandle,
  productTitle,
  imageUrl,
  priceLabel,
  defaultVariantId,
  canDirectBuy,
}: ImpulseProductActionsProps) {
  const params = useParams<{ countryCode: string }>()
  const countryCode = useMemo(() => params?.countryCode || "us", [params])
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleQuickBuy = () => {
    if (!canDirectBuy || !defaultVariantId || !countryCode) {
      return
    }

    startTransition(async () => {
      await addToCart({
        variantId: defaultVariantId,
        quantity: 1,
        countryCode,
      })
      setJustAdded(true)
    })
  }

  useEffect(() => {
    if (!justAdded) {
      return
    }

    const timer = window.setTimeout(() => {
      setJustAdded(false)
    }, 1800)

    return () => {
      window.clearTimeout(timer)
    }
  }, [justAdded])

  return (
    <>
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[4] translate-y-full opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <div className="grid gap-2">
          {canDirectBuy ? (
            <button
              type="button"
              onClick={handleQuickBuy}
              disabled={isPending}
              className="flex h-10 items-center justify-center rounded-[2px] bg-[#e8283a] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Adding..." : justAdded ? "Added" : "Quick buy"}
            </button>
          ) : (
            <LocalizedClientLink
              href={`/products/${productHandle}`}
              className="flex h-10 items-center justify-center rounded-[2px] border border-[var(--pi-border-strong)] bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--pi-text)]"
            >
              Select options
            </LocalizedClientLink>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 items-center justify-center rounded-[2px] border border-white/65 bg-black/55 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            Quick view
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="grid w-full max-w-[760px] overflow-hidden rounded-[6px] bg-white small:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/5] w-full bg-[#f5f5f5]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={productTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  unoptimized={shouldUnoptimizeImage(imageUrl)}
                  className="object-cover object-center"
                />
              ) : null}
            </div>
            <div className="grid content-between gap-6 p-6 small:p-8">
              <div className="grid gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a21f2e]">
                  Quick preview
                </span>
                <h3 className="text-3xl leading-[1.05] text-[var(--pi-text)]">
                  {productTitle}
                </h3>
                {priceLabel ? (
                  <p className="text-base font-medium text-[var(--pi-muted)]">
                    {priceLabel}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3">
                {canDirectBuy ? (
                  <button
                    type="button"
                    onClick={handleQuickBuy}
                    disabled={isPending}
                    className="theme-solid-button !w-full !justify-center !rounded-[2px] !border-[#e8283a] !bg-[#e8283a]"
                  >
                    {isPending ? "Adding..." : "Quick buy"}
                  </button>
                ) : null}
                <LocalizedClientLink
                  href={`/products/${productHandle}`}
                  className="theme-outline-button !w-full !justify-center !rounded-[2px]"
                >
                  View details
                </LocalizedClientLink>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center text-xs font-medium uppercase tracking-[0.14em] text-[var(--pi-muted)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
