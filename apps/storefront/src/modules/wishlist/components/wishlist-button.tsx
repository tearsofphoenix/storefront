"use client"

import { addVariantToWishlist, removeWishlistItem, retrieveWishlist } from "@lib/data/wishlist"
import { useI18n } from "@lib/i18n/use-i18n"
import ErrorMessage from "@modules/checkout/components/error-message"
import HeartIcon from "@modules/common/icons/heart"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type WishlistButtonProps = {
  variantId: string
  className?: string
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  variantId,
  className = "",
}) => {
  const router = useRouter()
  const { messages } = useI18n()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const checkWishlistStatus = useCallback(async () => {
    setIsInWishlist(false)
    setWishlistItemId(null)

    try {
      const wishlist = await retrieveWishlist()

      if (wishlist?.items) {
        const item = wishlist.items.find(
          (item) => item.product_variant_id === variantId
        )

        if (item) {
          setIsInWishlist(true)
          setWishlistItemId(item.id)
        }
      }
    } catch {
      setIsInWishlist(false)
      setWishlistItemId(null)
    }
  }, [variantId])

  useEffect(() => {
    checkWishlistStatus()
  }, [checkWishlistStatus])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)
    setErrorMessage("")

    try {
      if (isInWishlist && wishlistItemId) {
        const wishlist = await removeWishlistItem(wishlistItemId)

        if (!wishlist) {
          setErrorMessage(messages.account.wishlistActionFailed)
          return
        }

        setIsInWishlist(false)
        setWishlistItemId(null)
      } else {
        const wishlist = await addVariantToWishlist(variantId)

        if (!wishlist?.items) {
          setErrorMessage(messages.account.wishlistSignInRequired)
          return
        }

        const item = wishlist.items.find(
          (item) => item.product_variant_id === variantId
        )

        if (item) {
          setIsInWishlist(true)
          setWishlistItemId(item.id)
        }
      }
      router.refresh()
    } catch {
      setErrorMessage(messages.account.wishlistActionFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`group inline-flex items-center justify-center transition-all duration-200 ${
          isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
        } ${className}`}
        aria-label={
          isInWishlist
            ? messages.account.removeFromWishlist
            : messages.account.addToWishlist
        }
        title={
          isInWishlist
            ? messages.account.removeFromWishlist
            : messages.account.addToWishlist
        }
      >
        <HeartIcon
          filled={isInWishlist}
          className={`w-5 h-5 transition-colors duration-200 ${
            isInWishlist
              ? "text-red-500 group-hover:text-red-600"
              : "text-gray-400 group-hover:text-red-400"
          }`}
        />
      </button>
      <ErrorMessage error={errorMessage} data-testid="wishlist-button-error" />
    </div>
  )
}

export default WishlistButton
