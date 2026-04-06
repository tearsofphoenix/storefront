import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, {
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
} from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  process.env.MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  process.env.MEDUSA_STOREFRONT_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)
const originalFetchStream = sdk.client.fetchStream.bind(sdk.client)

const withLocaleHeaders = async (init?: FetchArgs) => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  return {
    ...init,
    headers: {
      ...localeHeader,
      ...headers,
    },
  } satisfies FetchArgs
}

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  return originalFetch(input, await withLocaleHeaders(init))
}

sdk.client.fetchStream = async (
  input: FetchInput,
  init?: FetchArgs
): Promise<FetchStreamResponse> => {
  return originalFetchStream(input, await withLocaleHeaders(init))
}
