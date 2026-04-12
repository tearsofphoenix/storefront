import { NextRequest, NextResponse } from "next/server"

const EXPO_GOOGLE_CALLBACK_URL = "panda://oauth/google"

export async function GET(request: NextRequest) {
  const redirectUrl = new URL(EXPO_GOOGLE_CALLBACK_URL)

  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.append(key, value)
  })

  return NextResponse.redirect(redirectUrl)
}
