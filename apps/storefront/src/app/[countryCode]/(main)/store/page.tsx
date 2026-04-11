import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.common.store,
    description: messages.store.catalogDescription,
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    view?: "grid" | "list"
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, view } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      view={view}
      countryCode={params.countryCode}
    />
  )
}
