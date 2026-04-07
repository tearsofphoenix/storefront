export const normalizeImageUrl = (url?: string | null) => {
  if (!url) {
    return null
  }

  const trimmedUrl = url.trim()

  if (!trimmedUrl) {
    return null
  }

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://")
  ) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`
  }

  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl
  }

  return `https://${trimmedUrl}`
}
