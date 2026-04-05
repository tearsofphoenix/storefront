type MedusaRequestErrorLike = {
  message?: string
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
  config?: {
    url?: string
    baseURL?: string
  }
}

export const logMedusaRequestError = (
  scope: string,
  error: unknown,
  extra?: Record<string, unknown>
) => {
  const medusaError = error as MedusaRequestErrorLike
  const status = medusaError?.response?.status
  const message =
    medusaError?.response?.data?.message ||
    medusaError?.message ||
    "Unknown Medusa request error"
  const requestUrl =
    medusaError?.config?.url && medusaError?.config?.baseURL
      ? new URL(medusaError.config.url, medusaError.config.baseURL).toString()
      : medusaError?.config?.url

  // 线上当前多处数据层会吞掉异常返回空值，这里补充服务端日志方便直接在部署日志定位环境差异。
  console.error(`[medusa:${scope}] request failed`, {
    status,
    message,
    requestUrl,
    backendUrl: process.env.MEDUSA_BACKEND_URL || "missing",
    hasPublishableKey: Boolean(
      process.env.MEDUSA_STOREFRONT_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    ),
    configuredSalesChannelId:
      process.env.MEDUSA_STOREFRONT_SALES_CHANNEL_ID || null,
    ...extra,
  })
}
