import "server-only"

import qs from "qs"

const getPayloadCmsUrl = () =>
  (
    process.env.PAYLOAD_CMS_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_CMS_URL
  )?.replace(/\/+$/, "")

export const isPayloadCmsConfigured = () => Boolean(getPayloadCmsUrl())

const buildPayloadUrl = (
  path: string,
  query?: Record<string, unknown>
) => {
  const baseUrl = getPayloadCmsUrl()

  if (!baseUrl) {
    return null
  }

  const queryString = query
    ? qs.stringify(query, {
        addQueryPrefix: true,
        encodeValuesOnly: true,
      })
    : ""

  return `${baseUrl}${path}${queryString}`
}

export const getPayloadMediaUrl = (url?: string | null) => {
  if (!url) {
    return null
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  const baseUrl = getPayloadCmsUrl()

  if (!baseUrl) {
    return url
  }

  if (url.startsWith("/")) {
    return `${baseUrl}${url}`
  }

  return `${baseUrl}/${url}`
}

export const payloadFetch = async <T>(
  path: string,
  options?: {
    query?: Record<string, unknown>
    tags?: string[]
  }
): Promise<T | null> => {
  const url = buildPayloadUrl(path, options?.query)

  if (!url) {
    return null
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      next: options?.tags?.length
        ? {
            revalidate: 60,
            tags: options.tags,
          }
        : {
            revalidate: 60,
          },
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("[payload-cms] request failed", {
        path,
        status: response.status,
        statusText: response.statusText,
      })
      return null
    }

    return (await response.json()) as T
  } catch (error) {
    console.error("[payload-cms] request error", {
      error,
      path,
    })
    return null
  }
}
