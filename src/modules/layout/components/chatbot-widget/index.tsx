"use client"

import { sdk } from "@lib/config"
import { useI18n } from "@lib/i18n/use-i18n"
import { trackChatbotEvent } from "@lib/util/chatbot-analytics"
import { Button } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ChatbotMessageContent from "./message-content"
import ChatbotMessageParts from "./message-parts"
import { useChatbotProductContext } from "./context"
import { getProductHandleFromPath } from "./shared"
import {
  ChatbotMessagePart,
  ChatbotProductContext,
  ChatbotSource,
} from "./types"

type ChatbotSettings = {
  is_enabled: boolean
  title: string
  welcome_message: string
  placeholder_text: string
  suggested_questions: string[]
  fallback_message: string
  handoff_message: string
}

type ChatbotMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  parts?: ChatbotMessagePart[]
  sources?: ChatbotSource[]
  handoffMessage?: string
  isStreaming?: boolean
  statusText?: string
}

const createMessageId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createWelcomeMessage = (content: string): ChatbotMessage[] => {
  return [
    {
      id: createMessageId(),
      role: "assistant",
      content,
    },
  ]
}

const ChatbotIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10.5h8M8 14h5m-8 5.5V5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v8.5A2.75 2.75 0 0 1 16.25 17H10l-5 2.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const ChatbotWidget = () => {
  const { messages, locale } = useI18n()
  const pathname = usePathname()
  const params = useParams()
  const { productContext } = useChatbotProductContext()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<ChatbotSettings | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatbotMessage[]>([])
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStreamingResponse, setIsStreamingResponse] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const conversationScopeRef = useRef<string | null>(null)
  const activeStreamAbortRef = useRef<(() => void) | null>(null)
  const countryCode = params.countryCode as string
  const productHandle = useMemo(() => getProductHandleFromPath(pathname), [pathname])
  const activeProductContext = useMemo<ChatbotProductContext | null>(() => {
    if (!productHandle || !productContext || productContext.handle !== productHandle) {
      return null
    }

    return productContext
  }, [productContext, productHandle])
  const conversationScope = activeProductContext?.handle
    ? `product:${activeProductContext.handle}`
    : "general"

  const resetConversation = useCallback(
    (nextSettings: ChatbotSettings | null = settings) => {
      if (!nextSettings) {
        return
      }

      activeStreamAbortRef.current?.()
      activeStreamAbortRef.current = null
      setChatMessages(createWelcomeMessage(nextSettings.welcome_message))
      setInput("")
      setError(null)
      setIsSubmitting(false)
      setIsStreamingResponse(false)
      setSessionId(crypto.randomUUID())
    },
    [settings]
  )

  useEffect(() => {
    return () => {
      activeStreamAbortRef.current?.()
      activeStreamAbortRef.current = null
    }
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await sdk.client.fetch<{ settings: ChatbotSettings }>(
          "/store/chatbot/settings",
          {
            method: "GET",
          }
        )

        setSettings(response.settings)
        setChatMessages(createWelcomeMessage(response.settings.welcome_message))
      } catch {
        setError(messages.chatbot.unavailable)
      } finally {
        setHasLoaded(true)
      }
    }

    void loadSettings()
  }, [messages.chatbot.unavailable])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isOpen])

  useEffect(() => {
    if (!settings || !hasLoaded) {
      return
    }

    const previousScope = conversationScopeRef.current

    if (previousScope && previousScope !== conversationScope) {
      resetConversation(settings)
    }

    conversationScopeRef.current = conversationScope
  }, [conversationScope, hasLoaded, resetConversation, settings])

  const sendMessage = async (rawValue: string) => {
    const trimmedValue = rawValue.trim()

    if (!trimmedValue || !settings || isSubmitting || isStreamingResponse) {
      return
    }

    const assistantMessageId = createMessageId()
    const requestMessages = [
      ...chatMessages,
      {
        id: createMessageId(),
        role: "user" as const,
        content: trimmedValue,
      },
    ].filter((message) => message.content.trim().length > 0)
    const nextMessages = [
      ...requestMessages,
      {
        id: assistantMessageId,
        role: "assistant" as const,
        content: "",
        isStreaming: true,
        statusText: messages.chatbot.thinking,
      },
    ]

    setChatMessages(nextMessages)
    setInput("")
    setError(null)
    setIsSubmitting(true)
    setIsStreamingResponse(true)
    trackChatbotEvent("chatbot_message_sent", {
      country_code: countryCode,
      page_path: pathname,
      product_handle: activeProductContext?.handle,
      question: trimmedValue,
      scope: activeProductContext ? "product" : "general",
    })

    try {
      const { stream, abort } = await sdk.client.fetchStream("/store/chatbot/message", {
        method: "POST",
        body: {
          session_id: sessionId,
          page_path: pathname,
          country_code: countryCode,
          language: typeof navigator !== "undefined" ? navigator.language : locale,
          product_handle: productHandle,
          product_context: activeProductContext ?? undefined,
          messages: requestMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
      })

      activeStreamAbortRef.current = abort

      if (!stream) {
        throw new Error("Chatbot stream was not established")
      }

      setIsSubmitting(false)

      let finalResponse:
        | {
            message: string
            parts?: ChatbotMessagePart[]
            sources?: ChatbotSource[]
            handoff_message?: string
          }
        | null = null
      let streamedMessage = ""

      for await (const event of stream) {
        if (!event.data) {
          continue
        }

        const payload = JSON.parse(event.data) as {
          delta?: string
          state?: string
          label?: string
          message?: string
          parts?: ChatbotMessagePart[]
          sources?: ChatbotSource[]
          handoff_message?: string
        }

        if (event.event === "chunk" && payload.delta) {
          streamedMessage = `${streamedMessage}${payload.delta}`
          setChatMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: `${message.content}${payload.delta ?? ""}`,
                    isStreaming: true,
                    statusText: undefined,
                  }
                : message
            )
          )
          continue
        }

        if (event.event === "status") {
          setChatMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    statusText: payload.label || messages.chatbot.thinking,
                  }
                : message
            )
          )
          continue
        }

        if (event.event === "done") {
          finalResponse = {
            message: payload.message || streamedMessage,
            parts: payload.parts,
            sources: payload.sources,
            handoff_message: payload.handoff_message,
          }
          activeStreamAbortRef.current = null
          setIsSubmitting(false)
          setIsStreamingResponse(false)
          break
        }

        if (event.event === "error") {
          finalResponse = {
            message: payload.message || streamedMessage || settings.fallback_message,
            parts: payload.parts,
            sources: payload.sources,
            handoff_message: payload.handoff_message,
          }
          activeStreamAbortRef.current = null
          setIsSubmitting(false)
          setIsStreamingResponse(false)
          break
        }
      }

      if (!finalResponse) {
        if (streamedMessage.trim()) {
          finalResponse = {
            message: streamedMessage,
            parts: [
              {
                type: "text",
                text: streamedMessage,
              },
            ],
          }
        } else {
          throw new Error("Chatbot stream ended without a final payload")
        }
      }

      setChatMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: finalResponse?.message || message.content,
                parts: finalResponse?.parts,
                sources: finalResponse?.sources,
                handoffMessage: finalResponse?.handoff_message,
                isStreaming: false,
                statusText: undefined,
              }
            : message
        )
      )
      trackChatbotEvent("chatbot_message_received", {
        country_code: countryCode,
        page_path: pathname,
        product_handle: activeProductContext?.handle,
        source_count: finalResponse.sources?.length ?? 0,
        scope: activeProductContext ? "product" : "general",
      })
    } catch (streamError) {
      if (streamError instanceof Error && streamError.name === "AbortError") {
        return
      }

      trackChatbotEvent("chatbot_error", {
        country_code: countryCode,
        page_path: pathname,
        product_handle: activeProductContext?.handle,
        scope: activeProductContext ? "product" : "general",
        error: "request_failed",
      })
      setError(settings.fallback_message || messages.chatbot.unavailable)
      setChatMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: settings.fallback_message || messages.chatbot.unavailable,
                sources: [{ type: "fallback", label: messages.chatbot.streamError }],
                handoffMessage: settings.handoff_message,
                isStreaming: false,
                statusText: undefined,
              }
            : message
        )
      )
    } finally {
      activeStreamAbortRef.current = null
      setIsSubmitting(false)
      setIsStreamingResponse(false)
    }
  }

  const handleToggle = () => {
    setIsOpen((currentValue) => {
      const nextValue = !currentValue

      trackChatbotEvent(nextValue ? "chatbot_opened" : "chatbot_closed", {
        country_code: countryCode,
        page_path: pathname,
        product_handle: activeProductContext?.handle,
        scope: activeProductContext ? "product" : "general",
      })

      return nextValue
    })
  }

  const handleReset = () => {
    resetConversation()
    trackChatbotEvent("chatbot_reset", {
      country_code: countryCode,
      page_path: pathname,
      product_handle: activeProductContext?.handle,
      scope: activeProductContext ? "product" : "general",
    })
  }

  if (!hasLoaded || !settings?.is_enabled) {
    return null
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed right-4 z-50 w-[calc(100vw-2rem)] max-w-[396px] overflow-hidden rounded-[20px] border border-[#d9dfe8] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] small:right-6"
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 5.75rem)",
          }}
        >
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {settings.title || messages.chatbot.title}
              </p>
              <p className="text-xs text-[#6b7280]">
                {activeProductContext
                  ? messages.chatbot.productContext
                  : messages.chatbot.generalContext}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-medium text-[#6b7280] transition-colors hover:text-[#111827]"
              >
                {messages.chatbot.reset}
              </button>
              <button
                type="button"
                onClick={handleToggle}
                className="text-sm text-[#6b7280] transition-colors hover:text-[#111827]"
              >
                {messages.chatbot.close}
              </button>
            </div>
          </div>

          {activeProductContext && (
            <div className="border-b border-[#eef2f7] bg-[#f8fafc] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                {messages.chatbot.currentProduct}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {activeProductContext.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activeProductContext.selected_variant_title && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#4b5563]">
                    {messages.chatbot.selectedVariant}:{" "}
                    {activeProductContext.selected_variant_title}
                  </span>
                )}
                {activeProductContext.price_label && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#4b5563]">
                    {messages.chatbot.price}: {activeProductContext.price_label}
                  </span>
                )}
                {typeof activeProductContext.selected_variant_in_stock ===
                  "boolean" && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#4b5563]">
                    {messages.chatbot.availability}:{" "}
                    {activeProductContext.selected_variant_in_stock
                      ? messages.chatbot.inStock
                      : messages.chatbot.outOfStock}
                  </span>
                )}
              </div>
            </div>
          )}

          <div
            className="no-scrollbar max-h-[420px] space-y-4 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {chatMessages.map((message) => {
              const isAssistant = message.role === "assistant"

              return (
                <div
                  key={message.id}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isAssistant
                        ? "bg-[#f3f4f6] text-[#111827]"
                        : "bg-[#111827] text-white"
                    }`}
                  >
                    {isAssistant && message.isStreaming ? (
                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.content ||
                          message.statusText ||
                          messages.chatbot.thinking}
                        <span className="ml-1 inline-block animate-pulse text-[#6b7280]">
                          |
                        </span>
                      </p>
                    ) : isAssistant ? (
                      message.parts && message.parts.length > 0 ? (
                        <ChatbotMessageParts parts={message.parts} />
                      ) : (
                        <ChatbotMessageContent content={message.content} />
                      )
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                    {isAssistant && message.sources && message.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.sources.map((source) => (
                          <span
                            key={`${message.id}-${source.type}-${source.label}`}
                            className="rounded-full bg-white px-2 py-1 text-[11px] text-[#4b5563]"
                          >
                            {source.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {isAssistant && message.handoffMessage && (
                      <p className="mt-3 text-xs text-[#6b7280]">
                        {message.handoffMessage}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            {isSubmitting && !chatMessages.some((message) => message.isStreaming) && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#f3f4f6] px-4 py-3 text-sm text-[#6b7280]">
                  {messages.chatbot.thinking}
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-rose-500">{error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {chatMessages.length <= 1 && settings.suggested_questions.length > 0 && (
            <div className="border-t border-[#f3f4f6] px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#6b7280]">
                {messages.chatbot.suggested}
              </p>
              <div className="flex flex-wrap gap-2">
                {settings.suggested_questions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => {
                      trackChatbotEvent("chatbot_suggested_question_clicked", {
                        country_code: countryCode,
                        page_path: pathname,
                        product_handle: activeProductContext?.handle,
                        question,
                        scope: activeProductContext ? "product" : "general",
                      })
                      void sendMessage(question)
                    }}
                    className="rounded-full border border-[#d9dfe8] px-3 py-1.5 text-xs text-[#111827] transition-colors hover:bg-[#f8fafc]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-[#e5e7eb] p-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void sendMessage(input)
                }
              }}
              placeholder={settings.placeholder_text || messages.chatbot.placeholder}
              className="min-h-[92px] w-full rounded-xl border border-[#d9dfe8] px-3 py-3 text-sm outline-none transition-colors focus:border-[#111827]"
              disabled={isSubmitting || isStreamingResponse}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#6b7280]">
                {countryCode?.toUpperCase()}
              </span>
              <Button
                type="button"
                onClick={() => {
                  void sendMessage(input)
                }}
                className="rounded-md bg-[#111827] text-white hover:bg-[#1f2937]"
                isLoading={isSubmitting}
                disabled={isSubmitting || isStreamingResponse || !input.trim()}
              >
                {messages.chatbot.send}
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)] transition-transform hover:-translate-y-0.5 small:right-6"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        }}
        data-testid="chatbot-toggle"
        aria-expanded={isOpen}
      >
        <ChatbotIcon />
        <span>{messages.chatbot.open}</span>
      </button>
    </>
  )
}

export default ChatbotWidget
