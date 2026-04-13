import { NextRequest, NextResponse } from "next/server"

const GOOGLE_AUTH_CALLBACK_PATH = "/api/auth/google"

export async function GET(request: NextRequest) {
  const redirectUrl = new URL(GOOGLE_AUTH_CALLBACK_PATH, request.url)

  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.append(key, value)
  })

  return NextResponse.redirect(redirectUrl)
}
