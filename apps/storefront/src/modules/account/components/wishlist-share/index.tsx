"use client"

import { shareWishlist } from "@lib/data/wishlist"
import { useI18n } from "@lib/i18n/use-i18n"
import { Button, Input, Text } from "@medusajs/ui"
import { useParams } from "next/navigation"
import { useState } from "react"

import ErrorMessage from "@modules/checkout/components/error-message"

type WishlistShareProps = {
  disabled?: boolean
}

const WishlistShare = ({ disabled = false }: WishlistShareProps) => {
  const { messages } = useI18n()
  const params = useParams()
  const countryCode = params.countryCode as string
  const [shareUrl, setShareUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const buildShareUrl = (token: string) => {
    if (typeof window === "undefined") {
      return `/${countryCode}/wishlists/${token}`
    }

    return `${window.location.origin}/${countryCode}/wishlists/${token}`
  }

  const handleGenerate = async () => {
    setIsSubmitting(true)
    setIsCopied(false)
    setErrorMessage("")

    try {
      const token = await shareWishlist()

      if (!token) {
        setErrorMessage(messages.account.wishlistShareFailed)
        return
      }

      setShareUrl(buildShareUrl(token))
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : messages.account.wishlistShareFailed
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) {
      return
    }

    setErrorMessage("")

    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
    } catch {
      setErrorMessage(messages.account.wishlistCopyFailed)
    }
  }

  return (
    <div className="rm-panel-soft mb-6 flex flex-col gap-3 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-large-semi">{messages.account.shareWishlist}</h2>
        <Text className="text-small-regular text-ui-fg-subtle">
          {messages.account.shareWishlistDescription}
        </Text>
      </div>

      <div className="flex flex-col gap-2 small:flex-row">
        <Button
          variant="secondary"
          onClick={handleGenerate}
          isLoading={isSubmitting}
          disabled={disabled || isSubmitting}
          data-testid="wishlist-generate-share-link"
        >
          {shareUrl
            ? messages.account.refreshShareLink
            : messages.account.generateShareLink}
        </Button>
        <Button
          variant="primary"
          onClick={handleCopy}
          disabled={!shareUrl || isSubmitting}
          data-testid="wishlist-copy-share-link"
        >
          {isCopied
            ? messages.account.wishlistLinkCopied
            : messages.account.copyShareLink}
        </Button>
      </div>

      {shareUrl ? (
        <div className="flex flex-col gap-2">
          <Input value={shareUrl} readOnly data-testid="wishlist-share-link" />
          <Text className="text-small-regular text-ui-fg-subtle">
            {messages.account.shareLinkReady}
          </Text>
        </div>
      ) : null}

      <ErrorMessage error={errorMessage} data-testid="wishlist-share-error" />
    </div>
  )
}

export default WishlistShare
