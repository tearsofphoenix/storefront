import { Metadata } from "next"

import { retrieveSharedWishlist } from "@lib/data/wishlist"
import { getI18n } from "@lib/i18n/server"
import WishlistItems from "@modules/account/components/wishlist-items"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@medusajs/ui"

type PageProps = {
  params: Promise<{ token: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n()

  return {
    title: messages.account.sharedWishlist,
    description: messages.account.sharedWishlistDescription,
  }
}

export default async function SharedWishlistPage({ params }: PageProps) {
  const { token } = await params
  const { messages } = await getI18n()
  const wishlist = await retrieveSharedWishlist(token)
  const hasItems = Boolean(wishlist?.items?.length)

  return (
    <div className="content-container py-10" data-testid="shared-wishlist-page">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl-semi">{messages.account.sharedWishlist}</h1>
          <p className="text-base-regular text-ui-fg-subtle">
            {messages.account.sharedWishlistDescription}
          </p>
        </div>

        {hasItems ? (
          <WishlistItems items={wishlist!.items} readOnly />
        ) : (
          <div className="rm-panel-soft flex flex-col gap-4 p-6">
            <p className="text-base-regular" data-testid="shared-wishlist-empty">
              {messages.account.invalidWishlistShare}
            </p>
            <LocalizedClientLink href="/store" className="w-fit">
              <Button variant="secondary">
                {messages.common.browseAllProducts}
              </Button>
            </LocalizedClientLink>
          </div>
        )}
      </div>
    </div>
  )
}
