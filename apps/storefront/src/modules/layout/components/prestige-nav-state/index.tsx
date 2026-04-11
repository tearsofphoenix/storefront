"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const TOP_SCROLL_THRESHOLD = 12

const isCountryHomePath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean)
  return segments.length === 1
}

export default function PrestigeNavState() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const isHome = isCountryHomePath(pathname || "")

    root.setAttribute("data-nav-home", isHome ? "true" : "false")

    const syncState = () => {
      if (!isHome) {
        root.setAttribute("data-nav-state", "scrolled")
        return
      }

      root.setAttribute(
        "data-nav-state",
        window.scrollY <= TOP_SCROLL_THRESHOLD ? "top" : "scrolled"
      )
    }

    syncState()

    if (isHome) {
      window.addEventListener("scroll", syncState, { passive: true })
    }

    return () => {
      window.removeEventListener("scroll", syncState)
    }
  }, [pathname])

  return null
}
