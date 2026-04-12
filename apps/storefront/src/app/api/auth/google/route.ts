import { sdk } from "@lib/config"
import { getCacheTag } from "@lib/data/cookies"
import { GOOGLE_AUTH_COUNTRY_COOKIE } from "@lib/util/google-auth"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

type DecodedGoogleAuthToken = {
  actor_id?: string | null
  email?: string
  first_name?: string
  last_name?: string
  user_metadata?: {
    email?: string
    first_name?: string
    last_name?: string
    given_name?: string
    family_name?: string
    name?: string
  }
  app_metadata?: {
    email?: string
    user_metadata?: {
      email?: string
      first_name?: string
      last_name?: string
      given_name?: string
      family_name?: string
      name?: string
    }
  }
}

const getCountryCode = (request: NextRequest) => {
  const cookieCountryCode = request.cookies
    .get(GOOGLE_AUTH_COUNTRY_COOKIE)
    ?.value?.toLowerCase()

  if (cookieCountryCode && /^[a-z]{2}$/.test(cookieCountryCode)) {
    return cookieCountryCode
  }

  return process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
}

const getAccountUrl = (request: NextRequest, countryCode: string) => {
  return new URL(`/${countryCode}/account`, request.url)
}

const getErrorRedirectResponse = (
  request: NextRequest,
  countryCode: string
) => {
  const redirectUrl = getAccountUrl(request, countryCode)
  redirectUrl.searchParams.set("auth_error", "google")

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.delete(GOOGLE_AUTH_COUNTRY_COOKIE)
  return response
}

const decodeGoogleAuthToken = (token: string): DecodedGoogleAuthToken => {
  const payload = token.split(".")[1]

  if (!payload) {
    throw new Error("Missing JWT payload")
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
}

const getCustomerProfileFromToken = (token: string) => {
  const decodedToken = decodeGoogleAuthToken(token)
  const userMetadata = decodedToken.user_metadata
  const appUserMetadata = decodedToken.app_metadata?.user_metadata
  const email =
    decodedToken.email ??
    userMetadata?.email ??
    decodedToken.app_metadata?.email ??
    appUserMetadata?.email

  if (!email) {
    throw new Error("Missing customer email in Google auth token")
  }

  const firstName =
    decodedToken.first_name ??
    userMetadata?.first_name ??
    userMetadata?.given_name ??
    appUserMetadata?.first_name ??
    appUserMetadata?.given_name

  const lastName =
    decodedToken.last_name ??
    userMetadata?.last_name ??
    userMetadata?.family_name ??
    appUserMetadata?.last_name ??
    appUserMetadata?.family_name

  return {
    actorId: decodedToken.actor_id,
    email,
    first_name: firstName,
    last_name: lastName,
  }
}

const revalidateCustomerAndCart = async () => {
  revalidateTag("customers")
  revalidateTag("carts")

  const customerCacheTag = await getCacheTag("customers")
  const cartCacheTag = await getCacheTag("carts")

  if (customerCacheTag) {
    revalidateTag(customerCacheTag)
  }

  if (cartCacheTag) {
    revalidateTag(cartCacheTag)
  }
}

const transferCartIfPossible = async (request: NextRequest, token: string) => {
  const cartId = request.cookies.get("_medusa_cart_id")?.value

  if (!cartId) {
    return
  }

  await sdk.store.cart.transferCart(
    cartId,
    {},
    { authorization: `Bearer ${token}` }
  )
}

export async function GET(request: NextRequest) {
  const countryCode = getCountryCode(request)

  if (request.nextUrl.searchParams.get("error")) {
    return getErrorRedirectResponse(request, countryCode)
  }

  try {
    const callbackToken = await sdk.auth.callback(
      "customer",
      "google",
      Object.fromEntries(request.nextUrl.searchParams.entries())
    )
    const customerProfile = getCustomerProfileFromToken(callbackToken)
    let customerToken = callbackToken

    if (!customerProfile.actorId) {
      await sdk.store.customer.create(
        {
          email: customerProfile.email,
          first_name: customerProfile.first_name,
          last_name: customerProfile.last_name,
        },
        {},
        { authorization: `Bearer ${callbackToken}` }
      )

      customerToken = await sdk.auth.refresh({
        authorization: `Bearer ${callbackToken}`,
      })
    }

    await transferCartIfPossible(request, customerToken).catch(() => null)
    await revalidateCustomerAndCart()

    const response = NextResponse.redirect(getAccountUrl(request, countryCode))

    response.cookies.set("_medusa_jwt", customerToken, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    response.cookies.delete(GOOGLE_AUTH_COUNTRY_COOKIE)

    return response
  } catch {
    return getErrorRedirectResponse(request, countryCode)
  }
}
