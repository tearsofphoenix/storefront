import { NextRequest, NextResponse } from "next/server"

const parseExtraData = (extraData?: string | null) => {
  if (!extraData) {
    return {
      cartId: null,
      returnPath: null,
    }
  }

  const searchParams = new URLSearchParams(extraData)
  const cartId = searchParams.get("cartId")
  const returnPath = searchParams.get("returnPath")

  if (cartId || returnPath) {
    return {
      cartId,
      returnPath,
    }
  }

  return {
    cartId: null,
    returnPath: extraData,
  }
}

const resolveReturnPath = (rawReturnPath?: string | null) => {
  if (!rawReturnPath) {
    return "/checkout?step=delivery"
  }

  if (rawReturnPath.startsWith("/") && !rawReturnPath.startsWith("//")) {
    return rawReturnPath
  }

  const normalizedCountryCode = rawReturnPath
    .replace(/[^a-zA-Z-]/g, "")
    .toLowerCase()

  if (normalizedCountryCode) {
    return `/${normalizedCountryCode}/checkout?step=delivery`
  }

  return "/checkout?step=delivery"
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  const cvsStoreId = formData.get("CVSStoreID")?.toString()
  const cvsStoreName = formData.get("CVSStoreName")?.toString()
  const cvsAddress = formData.get("CVSAddress")?.toString()
  const cvsTelephone = formData.get("CVSTelephone")?.toString()
  const logisticsSubType = formData.get("LogisticsSubType")?.toString()
  const extraData = formData.get("ExtraData")?.toString()
  const fallback = parseExtraData(extraData)
  const cartId = req.nextUrl.searchParams.get("cartId") || fallback.cartId
  const returnPath =
    req.nextUrl.searchParams.get("returnPath") || fallback.returnPath
  
  const redirectUrl = new URL(resolveReturnPath(returnPath), req.url)
  
  if (cvsStoreId) {
    redirectUrl.searchParams.set("cvsStoreId", cvsStoreId)
  }
  if (cvsStoreName) {
    redirectUrl.searchParams.set("cvsStoreName", cvsStoreName)
  }
  if (cvsAddress) {
    redirectUrl.searchParams.set("cvsAddress", cvsAddress)
  }
  if (cvsTelephone) {
    redirectUrl.searchParams.set("cvsTelephone", cvsTelephone)
  }
  if (logisticsSubType) {
    redirectUrl.searchParams.set("logisticsSubType", logisticsSubType)
  }

  // Redirect back to the checkout page
  const response = NextResponse.redirect(redirectUrl, 302)

  if (cartId) {
    response.cookies.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
  }

  return response
}
