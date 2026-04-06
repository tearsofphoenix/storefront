"use client"

import { sdk } from "@lib/config"
import { useI18n } from "@lib/i18n/use-i18n"
import { Button } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

type ChatbotSettings = {
  is_enabled: boolean
  title: string
  welcome_message: string
  placeholder_text: string
  suggested_questions: string[]
  fallback_message: string
  handoff_message: string
}

type ChatbotSource = {
  type: "faq" | "policy" | "product" | "fallback"
  label: string
}

type ChatbotMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: ChatbotSource[]
  handoffMessage?: string
}

const createMessageId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
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

const getProductHandleFromPath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length >= 3 && segments[1] === "products") {
    return segments[2]
  }

  return undefined
}

const ChatbotWidget = () => {
  const { messages } = useI18n()
  const pathname = usePathname()
  const params = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<ChatbotSettings | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatbotMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const countryCode = params.countryCode as string
  const productHandle = useMemo(() => getProductHandleFromPath(pathname), [pathname])

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
        setChatMessages([
          {
            id: createMessageId(),
            role: "assistant",
            content: response.settings.welcome_message,
          },
        ])
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

  const sendMessage = async (rawValue: string) => {
    const trimmedValue = rawValue.trim()

    if (!trimmedValue || !settings || isLoading) {
      return
    }

    const nextMessages = [
      ...chatMessages,
      {
        id: createMessageId(),
        role: "user" as const,
        content: trimmedValue,
      },
    ]

    setChatMessages(nextMessages)
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      const response = await sdk.client.fetch<{
        message: string
        sources?: ChatbotSource[]
        handoff_message?: string
      }>("/store/chatbot/message", {
        method: "POST",
        body: {
          session_id: sessionId,
          page_path: pathname,
          product_handle: productHandle,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
      })

      setChatMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: response.message,
          sources: response.sources,
          handoffMessage: response.handoff_message,
        },
      ])
    } catch {
      setError(settings.fallback_message || messages.chatbot.unavailable)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await sendMessage(input)
  }

  if (!hasLoaded || !settings?.is_enabled) {
    return null
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-[380px] rounded-[18px] border border-[#d9dfe8] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] small:right-6">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {settings.title || messages.chatbot.title}
              </p>
              <p className="text-xs text-[#6b7280]">
                {productHandle
                  ? messages.chatbot.productContext
                  : messages.chatbot.generalContext}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-[#6b7280] transition-colors hover:text-[#111827]"
            >
              {messages.chatbot.close}
            </button>
          </div>

          <div className="max-h-[420px] space-y-4 overflow-y-auto px-4 py-4">
            {chatMessages.map((message) => {
              const isAssistant = message.role === "assistant"

              return (
                <div
                  key={message.id}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isAssistant
                        ? "bg-[#f3f4f6] text-[#111827]"
                        : "bg-[#111827] text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
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

            {isLoading && (
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
                    onClick={() => void sendMessage(question)}
                    className="rounded-full border border-[#d9dfe8] px-3 py-1.5 text-xs text-[#111827] transition-colors hover:bg-[#f8fafc]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-[#e5e7eb] p-4">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={settings.placeholder_text || messages.chatbot.placeholder}
              className="min-h-[92px] w-full rounded-xl border border-[#d9dfe8] px-3 py-3 text-sm outline-none transition-colors focus:border-[#111827]"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#6b7280]">
                {countryCode?.toUpperCase()}
              </span>
              <Button
                type="submit"
                className="rounded-md bg-[#111827] text-white hover:bg-[#1f2937]"
                isLoading={isLoading}
                disabled={!input.trim()}
              >
                {messages.chatbot.send}
              </Button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full bg-[#111827] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)] transition-transform hover:-translate-y-0.5 small:right-6"
        data-testid="chatbot-toggle"
      >
        <ChatbotIcon />
        <span>{messages.chatbot.open}</span>
      </button>
    </>
  )
}

export default ChatbotWidget
