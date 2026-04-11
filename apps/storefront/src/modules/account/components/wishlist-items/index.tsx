"use client"

import { removeWishlistItem, type WishlistItem as WishlistItemType } from "@lib/data/wishlist"
import { useI18n } from "@lib/i18n/use-i18n"
import { Button } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter } from "next/navigation"

type WishlistItemsProps = {
  items: WishlistItemType[]
}

const WishlistItems = ({ items }: WishlistItemsProps) => {
  const router = useRouter()
  const { messages } = useI18n()

  const handleRemove = async (itemId: string) => {
    await removeWishlistItem(itemId)
    router.refresh()
  }

  return (
    <ul
      className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-4"
      data-testid="wishlist-items"
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="rm-panel-soft flex flex-col overflow-hidden"
          data-testid="wishlist-item"
        >
          <Thumbnail
            thumbnail={item.product_variant?.product?.thumbnail ?? null}
            alt={item.product_variant?.product?.title ?? ""}
            size="full"
          />
          <div className="flex flex-col gap-y-2 p-4">
            <h3 className="text-base-semi">
              {item.product_variant?.product?.title ?? "Unknown product"}
            </h3>
            {item.product_variant?.title && (
              <span className="text-small-regular text-ui-fg-subtle">
                {item.product_variant.title}
              </span>
            )}
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                variant="secondary"
                size="small"
                className="!flex-1"
                onClick={() => handleRemove(item.id)}
                data-testid="remove-wishlist-item"
              >
                {messages.account.removeFromWishlist}
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default WishlistItems
