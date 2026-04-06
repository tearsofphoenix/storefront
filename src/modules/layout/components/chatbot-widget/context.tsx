"use client"

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname } from "next/navigation"
import { ChatbotProductContext } from "./types"
import { getProductHandleFromPath } from "./shared"

type ChatbotProductContextValue = {
  productContext: ChatbotProductContext | null
  setProductContext: Dispatch<SetStateAction<ChatbotProductContext | null>>
}

const ChatbotProductContextState = createContext<ChatbotProductContextValue | null>(
  null
)

export const ChatbotProductContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const [productContext, setProductContext] =
    useState<ChatbotProductContext | null>(null)

  useEffect(() => {
    const productHandle = getProductHandleFromPath(pathname)

    if (!productHandle) {
      setProductContext(null)
      return
    }

    setProductContext((currentValue) => {
      if (currentValue?.handle === productHandle) {
        return currentValue
      }

      return null
    })
  }, [pathname])

  const value = useMemo(
    () => ({
      productContext,
      setProductContext,
    }),
    [productContext]
  )

  return (
    <ChatbotProductContextState.Provider value={value}>
      {children}
    </ChatbotProductContextState.Provider>
  )
}

export const useChatbotProductContext = () => {
  const context = useContext(ChatbotProductContextState)

  if (!context) {
    throw new Error("Chatbot product context provider is missing")
  }

  return context
}
