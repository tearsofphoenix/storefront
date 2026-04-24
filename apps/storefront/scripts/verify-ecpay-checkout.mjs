import fs from "node:fs"
import path from "node:path"

const loadDotEnv = () => {
  const envPath = path.join(process.cwd(), ".env")

  if (!fs.existsSync(envPath)) {
    return
  }

  const content = fs.readFileSync(envPath, "utf8")

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const delimiterIndex = trimmed.indexOf("=")

    if (delimiterIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, delimiterIndex).trim()
    const value = trimmed.slice(delimiterIndex + 1).trim()

    if (key && !process.env[key]) {
      process.env[key] = value
    }
  }
}

loadDotEnv()

const requiredEnv = [
  "MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
]

for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    console.error(`[verify-ecpay-checkout] missing required env: ${key}`)
    process.exit(1)
  }
}

const baseUrl = process.env.MEDUSA_BACKEND_URL.replace(/\/+$/, "")
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const storefrontBaseUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3010"
).replace(/\/+$/, "")

const headers = {
  "content-type": "application/json",
  "x-publishable-api-key": publishableKey,
}

const request = async (path, init = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init.headers || {}),
    },
  })

  const text = await response.text()
  let payload = null

  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = text
  }

  if (!response.ok) {
    throw new Error(
      `[verify-ecpay-checkout] ${response.status} ${response.statusText} ${JSON.stringify(
        payload
      )}`
    )
  }

  return payload
}

const getAvailableSalesChannels = async () => {
  const payload = await request("/store/products?limit=50&fields=id,*sales_channels", {
    method: "GET",
    headers: {
      "content-type": undefined,
    },
  })

  const channels = new Map()

  for (const product of payload.products || []) {
    for (const salesChannel of product.sales_channels || []) {
      if (salesChannel?.id) {
        channels.set(salesChannel.id, salesChannel)
      }
    }
  }

  return Array.from(channels.values())
}

const pickSalesChannelId = async () => {
  if (process.env.MEDUSA_STOREFRONT_SALES_CHANNEL_ID?.trim()) {
    return process.env.MEDUSA_STOREFRONT_SALES_CHANNEL_ID.trim()
  }

  const channels = await getAvailableSalesChannels()

  if (!channels.length) {
    return null
  }

  const taiwanChannel =
    channels.find((channel) =>
      channel.name?.trim().toLowerCase().includes("taiwan")
    ) || channels[0]

  return taiwanChannel.id
}

const main = async () => {
  const regionId = process.env.ECPAY_TEST_REGION_ID || "reg_01KNA4PP5PPZ7WJKY677X80RR7"
  const variantId =
    process.env.ECPAY_TEST_VARIANT_ID || "variant_01KNA62JAV1RCYRS52KES947JM"
  const salesChannelId = await pickSalesChannelId()

  if (!salesChannelId) {
    throw new Error("[verify-ecpay-checkout] unable to resolve sales channel id")
  }

  const createCartBody = {
    region_id: regionId,
    sales_channel_id: salesChannelId,
  }

  const createdCart = await request("/store/carts", {
    method: "POST",
    body: JSON.stringify(createCartBody),
  })
  const cartId = createdCart.cart.id

  await request(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: JSON.stringify({
      variant_id: variantId,
      quantity: 1,
    }),
  })

  await request(`/store/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({
      email: "codex-ecpay-test@example.com",
      shipping_address: {
        first_name: "Codex",
        last_name: "Tester",
        address_1: "No. 1, Test Road",
        address_2: "",
        city: "Taipei",
        country_code: "tw",
        postal_code: "100",
        province: "Taipei City",
        phone: "0911222333",
      },
      billing_address: {
        first_name: "Codex",
        last_name: "Tester",
        address_1: "No. 1, Test Road",
        address_2: "",
        city: "Taipei",
        country_code: "tw",
        postal_code: "100",
        province: "Taipei City",
        phone: "0911222333",
      },
    }),
  })

  const shippingOptions = await request(`/store/shipping-options?cart_id=${cartId}`, {
    method: "GET",
    headers: {
      "content-type": undefined,
    },
  })

  const ecpayOption = (shippingOptions.shipping_options || []).find((option) =>
    ["ecpay-logistics", "ecpay-logistics_ecpay-logistics"].includes(
      option.provider_id
    )
  )

  if (!ecpayOption) {
    throw new Error(
      `[verify-ecpay-checkout] ECPay shipping option not found for cart ${cartId}`
    )
  }

  await request(`/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({
      option_id: ecpayOption.id,
      data: {
        CVSStoreID: "131386",
        CVSStoreName: "全家台北測試店",
        CVSAddress: "台北市中正區測試路1號",
        CVSTelephone: "0223456789",
        LogisticsSubType: "FAMI",
      },
    }),
  })

  const cartPayload = await request(
    `/store/carts/${cartId}?fields=id,*shipping_methods,+shipping_methods.data`,
    {
      method: "GET",
      headers: {
        "content-type": undefined,
      },
    }
  )

  const shippingMethod = (cartPayload.cart.shipping_methods || []).find(
    (method) => method.shipping_option_id === ecpayOption.id
  )

  const shippingData = shippingMethod?.data || {}

  if (shippingData.CVSStoreID !== "131386") {
    throw new Error(
      `[verify-ecpay-checkout] expected CVSStoreID to persist on cart ${cartId}, got ${JSON.stringify(
        shippingData
      )}`
    )
  }

  const mapReplyResponse = await fetch(
    `${storefrontBaseUrl}/api/ecpay/map-reply?cartId=${encodeURIComponent(
      cartId
    )}&returnPath=${encodeURIComponent("/cn/checkout?step=delivery")}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        CVSStoreID: "131386",
        CVSStoreName: "全家台北測試店",
        CVSAddress: "台北市中正區測試路1號",
        CVSTelephone: "0223456789",
        LogisticsSubType: "FAMI",
        ExtraData: "tw",
      }),
      redirect: "manual",
    }
  )

  const location = mapReplyResponse.headers.get("location")
  const setCookie = mapReplyResponse.headers.get("set-cookie")

  if (
    !location ||
    !location.includes("/cn/checkout?step=delivery") ||
    !location.includes("cvsStoreId=131386")
  ) {
    throw new Error(
      `[verify-ecpay-checkout] unexpected map reply redirect: ${location}`
    )
  }

  if (!setCookie?.includes(`_medusa_cart_id=${cartId}`)) {
    throw new Error(
      `[verify-ecpay-checkout] map reply did not restore cart cookie for ${cartId}`
    )
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        cartId,
        salesChannelId,
        shippingOptionId: ecpayOption.id,
        persistedShippingData: shippingData,
        mapReplyRedirect: location,
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
