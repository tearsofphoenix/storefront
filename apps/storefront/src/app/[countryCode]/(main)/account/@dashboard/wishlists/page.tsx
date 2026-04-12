import { Metadata } from "next"
import { getI18n } from "@lib/i18n/server"
import { retrieveWishlist } from "@lib/data/wishlist"
import WishlistItems from "@modules/account/components/wishlist-items"
import WishlistShare from "@modules/account/components/wishlist-share"

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.wishlists,
    description: messages.account.wishlistsDescription,
  }
}

export default async function Wishlists() {
  const { messages } = await getI18n()
  const wishlist = await retrieveWishlist()

  return (
    <div className="w-full" data-testid="wishlists-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{messages.account.wishlists}</h1>
        <p className="text-base-regular">
          {messages.account.wishlistsDescription}
        </p>
      </div>
      <div>
        <WishlistShare disabled={!wishlist?.items?.length} />
        {wishlist?.items && wishlist.items.length > 0 ? (
          <WishlistItems items={wishlist.items} />
        ) : (
          <span className="text-base-regular" data-testid="no-wishlist-items">
            {messages.account.noWishlistItems}
          </span>
        )}
      </div>
    </div>
  )
}
