import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

function readRuntimeEnv(name: string) {
  return process.env[name]
}

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (readRuntimeEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL")) {
  MEDUSA_BACKEND_URL = readRuntimeEnv("NEXT_PUBLIC_MEDUSA_BACKEND_URL") as string
} else if (readRuntimeEnv("MEDUSA_BACKEND_URL")) {
  MEDUSA_BACKEND_URL = readRuntimeEnv("MEDUSA_BACKEND_URL") as string
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey:
    readRuntimeEnv("MEDUSA_STOREFRONT_PUBLISHABLE_KEY") ||
    readRuntimeEnv("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY"),
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }
  init = {
    ...init,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
