import type { Metadata } from "next"

import ForBrandsTemplate from "@modules/for-brands/templates"

export const metadata: Metadata = {
  title: "Panda Commerce for Brands",
  description:
    "Launch a Medusa storefront faster with premium themes, CMS integration, and AI commerce add-ons.",
}

export default function ForBrandsPage() {
  return <ForBrandsTemplate />
}
