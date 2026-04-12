import { resolveStorefrontName } from "@lib/util/storefront-info"
import { NextResponse } from "next/server"

export async function GET() {
  const storeName = await resolveStorefrontName()

  return NextResponse.json({
    store: {
      name: storeName,
    },
  })
}
