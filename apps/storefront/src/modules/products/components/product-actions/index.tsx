"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { useI18n } from "@lib/i18n/use-i18n"
import { StorefrontThemePresetKey } from "@lib/util/theme-presets"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import WishlistButton from "@modules/wishlist/components/wishlist-button"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  themePresetKey?: StorefrontThemePresetKey
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  themePresetKey,
}: ProductActionsProps) {
  const { messages } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [countdown, setCountdown] = useState(20 * 60)
  const countryCode = useParams().countryCode as string
  const isImpulse = themePresetKey === "impulse"

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  useEffect(() => {
    if (!isImpulse) {
      return
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          return 20 * 60
        }
        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isImpulse])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [isValidVariant, pathname, router, searchParams, selectedVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")
  const countdownLabel = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(
    countdown % 60
  ).padStart(2, "0")}`

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div
        className="flex flex-col gap-y-5 border border-[var(--pi-border)] bg-[var(--pi-surface)] p-6"
        ref={actionsRef}
        id="product-actions-panel"
      >
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <div className="flex items-center gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="theme-solid-button !h-11 !flex-1 !rounded-none !border-[var(--pi-primary)] !bg-[var(--pi-primary)] !text-white hover:!border-[var(--pi-primary-hover)] hover:!bg-[var(--pi-primary-hover)]"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant
              ? messages.common.selectVariant
              : !inStock
              ? messages.common.outOfStock
              : messages.common.addToCart}
          </Button>
          {selectedVariant?.id && (
            <WishlistButton variantId={selectedVariant.id} />
          )}
        </div>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      {isImpulse && !inView ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pi-border)] bg-[rgba(255,255,255,0.96)] px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
            <div className="min-w-0">
              <p
                className="truncate text-sm font-medium"
                style={{ fontFamily: "var(--pi-heading-font)" }}
              >
                {product.title}
              </p>
              <p className="text-xs text-[var(--pi-muted)]">
                Deal ends in{" "}
                <span className="font-semibold text-[#d9480f]">
                  {countdownLabel}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a
                href="#product-actions-panel"
                className="theme-outline-button !h-10 !rounded-[2px] !px-4 !text-xs !uppercase !tracking-[0.12em]"
              >
                Choose options
              </a>
              <Button
                onClick={handleAddToCart}
                disabled={
                  !inStock ||
                  !selectedVariant ||
                  !!disabled ||
                  isAdding ||
                  !isValidVariant
                }
                variant="primary"
                className="theme-solid-button !h-10 !rounded-[2px] !border-[#e8283a] !bg-[#e8283a] !px-4 !text-xs !uppercase !tracking-[0.12em]"
                isLoading={isAdding}
              >
                {!selectedVariant
                  ? messages.common.selectVariant
                  : !inStock
                  ? messages.common.outOfStock
                  : messages.common.addToCart}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
