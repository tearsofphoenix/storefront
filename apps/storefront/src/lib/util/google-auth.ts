import { getBaseURL } from "./env"

export const GOOGLE_AUTH_COUNTRY_COOKIE = "_google_auth_country_code"

export const getGoogleAuthCallbackUrl = () => {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  return `${baseUrl}/api/auth/google`
}
