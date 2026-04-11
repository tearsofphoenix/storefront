"use client"

import { useMemo, useState, useTransition } from "react"

import { useParams } from "next/navigation"

import { addToCart } from "@lib/data/cart"

type EmpireQuickAddProps = {
  variantId?: string | null
  canQuickAdd: boolean
}

export default function EmpireQuickAdd({
  variantId,
  canQuickAdd,
}: EmpireQuickAddProps) {
  const params = useParams<{ countryCode: string }>()
  const countryCode = useMemo(() => params?.countryCode || "us", [params])
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!variantId || !canQuickAdd) {
      return
    }

    startTransition(async () => {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
      setAdded(true)
      window.setTimeout(() => setAdded(false), 1600)
    })
  }

  if (!canQuickAdd) {
    return (
      <span className="rounded-[16px] border border-[var(--pi-border)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--pi-muted)]">
        Choose options
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending}
      className="rounded-[16px] border border-[#ffd814] bg-[#ffd814] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f1111] transition-colors hover:bg-[#f7ca00] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Adding..." : added ? "Added" : "Quick add"}
    </button>
  )
}
