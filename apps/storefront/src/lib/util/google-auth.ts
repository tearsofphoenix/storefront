import { getBaseURL } from "./env"

export const GOOGLE_AUTH_COUNTRY_COOKIE = "_google_auth_country_code"

const getGoogleAuthCompatCountryCode = () => {
  const countryCode = (
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
  ).toLowerCase()

  return /^[a-z]{2}$/.test(countryCode) ? countryCode : "us"
}

export const getGoogleAuthCallbackUrl = () => {
  const baseUrl = getBaseURL().replace(/\/$/, "")
  const countryCode = getGoogleAuthCompatCountryCode()

  return `${baseUrl}/${countryCode}/account/google`
}
