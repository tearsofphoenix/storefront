export const getProductHandleFromPath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length >= 3 && segments[1] === "products") {
    return segments[2]
  }

  return undefined
}
