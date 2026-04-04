import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getI18n } from "@lib/i18n/server"
import { getRegion } from "@lib/data/regions"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.home.metadataTitle,
    description: messages.home.metadataDescription,
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections) {
    return null
  }

  return (
    <>
      <Hero collection={collections[0] ?? null} region={region} />
      <FeaturedProducts
        collections={collections.slice(0, 1)}
        region={region}
      />
    </>
  )
}
