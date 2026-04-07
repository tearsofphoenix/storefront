import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode } from "react"

type CmsLinkProps = {
  children: ReactNode
  href?: string | null
  className?: string
}

const isExternalHref = (href: string) =>
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:")

export const CmsLink = ({ children, href, className }: CmsLinkProps) => {
  if (!href) {
    return null
  }

  if (isExternalHref(href)) {
    return (
      <a
        className={className}
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  const normalizedHref = href.startsWith("/") ? href : `/${href}`

  return (
    <LocalizedClientLink className={className} href={normalizedHref}>
      {children}
    </LocalizedClientLink>
  )
}
