type ChatbotEventName =
  | "chatbot_opened"
  | "chatbot_closed"
  | "chatbot_reset"
  | "chatbot_message_sent"
  | "chatbot_message_received"
  | "chatbot_suggested_question_clicked"
  | "chatbot_error"

type ChatbotEventPayload = {
  country_code?: string
  page_path?: string
  product_handle?: string
  question?: string
  source_count?: number
  scope?: "general" | "product"
  error?: string
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export const trackChatbotEvent = (
  eventName: ChatbotEventName,
  payload: ChatbotEventPayload = {}
) => {
  if (typeof window === "undefined") {
    return
  }

  const detail = {
    ...payload,
    event_name: eventName,
    occurred_at: new Date().toISOString(),
  }

  window.dispatchEvent(
    new CustomEvent("storefront:chatbot", {
      detail,
    })
  )

  window.dataLayer?.push({
    event: eventName,
    chatbot: detail,
  })
}
