"use client"

import { useEffect } from "react"
import { useChatbotProductContext } from "@modules/layout/components/chatbot-widget/context"
import { ChatbotProductContext } from "@modules/layout/components/chatbot-widget/types"

type ChatbotContextSyncProps = {
  productContext: ChatbotProductContext
}

const ChatbotContextSync = ({ productContext }: ChatbotContextSyncProps) => {
  const { setProductContext } = useChatbotProductContext()

  useEffect(() => {
    setProductContext(productContext)

    return () => {
      setProductContext((currentValue) => {
        if (currentValue?.handle === productContext.handle) {
          return null
        }

        return currentValue
      })
    }
  }, [productContext, setProductContext])

  return null
}

export default ChatbotContextSync
