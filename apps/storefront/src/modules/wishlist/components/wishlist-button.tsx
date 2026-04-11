"use client"

import { addVariantToWishlist, removeWishlistItem, retrieveWishlist } from "@lib/data/wishlist"
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
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkWishlistStatus = useCallback(async () => {
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
  }, [variantId])

  useEffect(() => {
    checkWishlistStatus()
  }, [checkWishlistStatus])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    setIsLoading(true)

    try {
      if (isInWishlist && wishlistItemId) {
        await removeWishlistItem(wishlistItemId)
        setIsInWishlist(false)
        setWishlistItemId(null)
      } else {
        const wishlist = await addVariantToWishlist(variantId)
        if (wishlist?.items) {
          const item = wishlist.items.find(
            (item) => item.product_variant_id === variantId
          )
          if (item) {
            setIsInWishlist(true)
            setWishlistItemId(item.id)
          }
        }
      }
      router.refresh()
    } catch (error) {
      console.error("Wishlist toggle failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`group inline-flex items-center justify-center transition-all duration-200 ${
        isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"
      } ${className}`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
  )
}

export default WishlistButton
