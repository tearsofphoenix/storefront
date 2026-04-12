"use client"

import { removeWishlistItem, type WishlistItem as WishlistItemType } from "@lib/data/wishlist"
import { useI18n } from "@lib/i18n/use-i18n"
import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter } from "next/navigation"

type WishlistItemsProps = {
  items: WishlistItemType[]
  readOnly?: boolean
}

const WishlistItems = ({ items, readOnly = false }: WishlistItemsProps) => {
  const router = useRouter()
  const { messages } = useI18n()

  const isMeaningfulVariantTitle = (title?: string) => {
    if (!title) {
      return false
    }

    return title.trim().toLowerCase() !== "default variant"
  }

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
            size="square"
          />
          <div className="flex flex-col gap-y-2 p-4">
            {item.product_variant?.product?.handle ? (
              <LocalizedClientLink
                href={`/products/${item.product_variant.product.handle}`}
                className="text-base-semi"
              >
                {item.product_variant?.product?.title ?? messages.account.unknownProduct}
              </LocalizedClientLink>
            ) : (
              <h3 className="text-base-semi">
                {item.product_variant?.product?.title ?? messages.account.unknownProduct}
              </h3>
            )}
            {isMeaningfulVariantTitle(item.product_variant?.title) && (
              <span className="text-small-regular text-ui-fg-subtle">
                {item.product_variant.title}
              </span>
            )}
            {!readOnly ? (
              <div className="mt-2 flex items-center gap-x-2">
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
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default WishlistItems
