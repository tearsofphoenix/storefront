import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  const cvsStoreId = formData.get("CVSStoreID")?.toString()
  const cvsStoreName = formData.get("CVSStoreName")?.toString()
  const cvsAddress = formData.get("CVSAddress")?.toString()
  const cvsTelephone = formData.get("CVSTelephone")?.toString()
  const logisticsSubType = formData.get("LogisticsSubType")?.toString()
  const extraData = formData.get("ExtraData")?.toString() // We can pass countryCode here
  
  const redirectUrl = new URL("/checkout", req.url)
  
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
  return NextResponse.redirect(redirectUrl, 302)
}
