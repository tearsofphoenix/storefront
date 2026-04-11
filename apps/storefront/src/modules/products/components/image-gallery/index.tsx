"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

import { normalizeImageUrl } from "@lib/util/normalize-image-url"
import { shouldUnoptimizeImage } from "@lib/util/should-unoptimize-image"
import { useI18n } from "@lib/i18n/use-i18n"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const { messages } = useI18n()
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
  const [isPorto, setIsPorto] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(false)

  useEffect(() => {
    if (selectedIndex > galleryImages.length - 1) {
      setSelectedIndex(0)
    }
  }, [galleryImages.length, selectedIndex])

  useEffect(() => {
    setIsPorto(document.documentElement.getAttribute("data-theme") === "porto")
  }, [])

  useEffect(() => {
    if (!isPorto || !isAutoPlay || galleryImages.length < 2) {
      return
    }

    const interval = window.setInterval(() => {
      setSelectedIndex((current) => (current + 1) % galleryImages.length)
    }, 900)

    return () => window.clearInterval(interval)
  }, [galleryImages.length, isAutoPlay, isPorto])

  const selectedImage = galleryImages[selectedIndex]

  if (!selectedImage) {
    return (
      <Container className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--pi-border)] bg-[var(--pi-surface-soft)]" />
    )
  }

  if (isPorto) {
    return (
      <div className="grid gap-4 rounded-[2px] border border-[var(--pi-border)] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--pi-border)] pb-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--pi-muted-soft)]">
            <span className="rounded-[2px] bg-[var(--pi-surface-soft)] px-3 py-1 text-[var(--pi-primary)]">
              360 preview
            </span>
            <span>{selectedIndex + 1} / {galleryImages.length} frames</span>
          </div>
          {galleryImages.length > 1 ? (
            <button
              type="button"
              onClick={() => setIsAutoPlay((current) => !current)}
              className="rounded-[2px] border border-[var(--pi-border)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pi-text)]"
            >
              {isAutoPlay ? "Pause spin" : "Play spin"}
            </button>
          ) : null}
        </div>
        <div className="grid gap-4 small:grid-cols-[96px_minmax(0,1fr)] small:items-start">
          <div className="order-2 flex gap-3 overflow-x-auto pb-1 small:order-1 small:flex-col small:overflow-visible">
            {galleryImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setIsAutoPlay(false)
                  setSelectedIndex(index)
                }}
                className={clx(
                  "shrink-0 rounded-[2px] border p-1 transition-colors",
                  {
                    "border-[var(--pi-primary)] bg-[var(--pi-surface-soft)]":
                      index === selectedIndex,
                    "border-[var(--pi-border)] bg-[var(--pi-surface)]":
                      index !== selectedIndex,
                  }
                )}
              >
                <div className="relative aspect-square w-16 overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-white small:w-[86px]">
                  <Image
                    src={image.url}
                    alt={`${messages.product.productThumbnailAlt} ${index + 1}`}
                    fill
                    sizes="88px"
                    unoptimized={shouldUnoptimizeImage(image.url)}
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
          <Container className="order-1 relative aspect-[4/5] w-full overflow-hidden rounded-[2px] border border-[var(--pi-border)] bg-[var(--pi-surface-soft)] small:order-2">
            <Image
              src={selectedImage.url}
              alt={messages.product.productImageAlt}
              priority
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              unoptimized={shouldUnoptimizeImage(selectedImage.url)}
              className="object-cover"
            />
          </Container>
        </div>
      </div>
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
                "border-[var(--pi-border-strong)] bg-[var(--pi-surface-emphasis)]":
                  index === selectedIndex,
                "border-[var(--pi-border)] bg-[var(--pi-surface)]":
                  index !== selectedIndex,
              }
            )}
          >
            <div className="relative aspect-square w-16 overflow-hidden border border-[var(--pi-border)] bg-[#fff] small:w-[78px]">
              <Image
                src={image.url}
                alt={`${messages.product.productThumbnailAlt} ${index + 1}`}
                fill
                sizes="80px"
                unoptimized={shouldUnoptimizeImage(image.url)}
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
      <Container className="order-1 relative aspect-[4/5] w-full overflow-hidden border border-[var(--pi-border)] bg-[var(--pi-surface-soft)] small:order-2">
        <Image
          src={selectedImage.url}
          alt={messages.product.productImageAlt}
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
