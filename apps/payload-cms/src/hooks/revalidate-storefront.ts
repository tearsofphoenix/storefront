import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

const getStorefrontRevalidateUrl = () =>
  process.env.FRONTEND_REVALIDATE_URL?.replace(/\/+$/, '') || undefined

const getRevalidateSecret = () => process.env.REVALIDATE_SECRET || undefined

const postRevalidate = async (tags: Array<string | null | undefined>) => {
  const url = getStorefrontRevalidateUrl()
  const secret = getRevalidateSecret()
  const normalizedTags = Array.from(
    new Set(tags.map((tag) => tag?.trim()).filter(Boolean) as string[]),
  )

  if (!url || !secret || normalizedTags.length === 0) {
    return
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({
        tags: normalizedTags,
      }),
    })
  } catch (error) {
    console.error('[payload-cms] failed to trigger storefront revalidation', error)
  }
}

type ProductPageLike = {
  id: string | number
  handle?: string | null
}

type LandingPageLike = {
  id: string | number
  slug?: string | null
}

export const revalidateProductPageAfterChange: CollectionAfterChangeHook<ProductPageLike> = async ({
  doc,
  previousDoc,
}) => {
  await postRevalidate([
    doc.handle ? `payload:product-page:${doc.handle}` : null,
    previousDoc?.handle ? `payload:product-page:${previousDoc.handle}` : null,
  ])

  return doc
}

export const revalidateProductPageAfterDelete: CollectionAfterDeleteHook<ProductPageLike> = async ({
  doc,
}) => {
  await postRevalidate([doc.handle ? `payload:product-page:${doc.handle}` : null])

  return doc
}

export const revalidateLandingPageAfterChange: CollectionAfterChangeHook<LandingPageLike> = async ({
  doc,
  previousDoc,
}) => {
  await postRevalidate([
    doc.slug ? `payload:landing-page:${doc.slug}` : null,
    previousDoc?.slug ? `payload:landing-page:${previousDoc.slug}` : null,
  ])

  return doc
}

export const revalidateLandingPageAfterDelete: CollectionAfterDeleteHook<LandingPageLike> = async ({
  doc,
}) => {
  await postRevalidate([doc.slug ? `payload:landing-page:${doc.slug}` : null])

  return doc
}

export const revalidateSiteSettingsAfterChange: GlobalAfterChangeHook = async ({
  doc,
}) => {
  await postRevalidate(['payload:globals:site-settings'])

  return doc
}
