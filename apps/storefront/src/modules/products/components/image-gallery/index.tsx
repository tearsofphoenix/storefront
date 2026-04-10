"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

import { normalizeImageUrl } from "@lib/util/normalize-image-url"
import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const galleryImages = useMemo(
    () =>
      images
        .map((image) => ({
          id: image.id,
          url: normalizeImageUrl(image.url),
        }))
        .filter(
          (image): image is { id: string; url: string } => Boolean(image.url)
        ),
    [images]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (selectedIndex > galleryImages.length - 1) {
      setSelectedIndex(0)
    }
  }, [galleryImages.length, selectedIndex])

  const selectedImage = galleryImages[selectedIndex]

  if (!selectedImage) {
    return (
      <Container className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--rm-border)] bg-[var(--rm-surface-soft)]" />
    )
  }

  return (
    <div className="grid gap-4 small:grid-cols-[88px_minmax(0,1fr)] small:items-start">
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 small:order-1 small:flex-col small:overflow-visible">
        {galleryImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={clx(
              "shrink-0 border p-1 transition-colors",
              {
                "border-[var(--rm-border-strong)] bg-[var(--rm-surface-emphasis)]":
                  index === selectedIndex,
                "border-[var(--rm-border)] bg-[var(--rm-surface)]":
                  index !== selectedIndex,
              }
            )}
          >
            <div className="relative aspect-square w-16 overflow-hidden border border-[var(--rm-border)] bg-[#fff] small:w-[78px]">
              <Image
                src={image.url}
                alt={`Product thumbnail ${index + 1}`}
                fill
                sizes="80px"
                unoptimized={shouldUnoptimizeImage(image.url)}
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
      <Container className="order-1 relative aspect-[4/5] w-full overflow-hidden border border-[var(--rm-border)] bg-[var(--rm-surface-soft)] small:order-2">
        <Image
          src={selectedImage.url}
          alt="Product image"
          priority
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          unoptimized={shouldUnoptimizeImage(selectedImage.url)}
          className="object-cover"
        />
      </Container>
    </div>
  )
}

export default ImageGallery
