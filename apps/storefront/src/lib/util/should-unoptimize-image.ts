const UNOPTIMIZED_IMAGE_HOSTS = new Set(["estore-cf.pandacat.ai"])

export const shouldUnoptimizeImage = (url?: string | null) => {
  if (!url) {
    return false
  }

  try {
    const parsedUrl = new URL(url, "https://localhost")

    return UNOPTIMIZED_IMAGE_HOSTS.has(parsedUrl.hostname)
  } catch {
    return false
  }
}
