"use client"

import { addToCart } from "@lib/data/cart"
import { useI18n } from "@lib/i18n/use-i18n"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { listProducts } from "@lib/data/products"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ChatbotInteractiveProductActions({
  productHandle,
}: {
  productHandle: string
}) {
  const { messages } = useI18n()
  const countryCode = useParams().countryCode as string

  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    let isMounted = true
    listProducts({ countryCode, queryParams: { handle: productHandle } })
      .then(({ response }) => {
        if (isMounted && response.products.length > 0) {
          const p = response.products[0]
          setProduct(p)
          if (p.variants?.length === 1) {
            setOptions(optionsAsKeymap(p.variants[0].options) ?? {})
          }
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [countryCode, productHandle])

  const selectedVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product?.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
    setIsSuccess(false)
  }

  const isValidVariant = useMemo(() => {
    return product?.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product?.variants, options])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
    }, 2500)
  }

  if (!product) {
    return (
      <div className="mt-4 flex h-9 w-full animate-pulse items-center justify-center border border-[var(--rm-border)] bg-[var(--rm-surface-soft)] text-xs text-[#6b7280]">
        {messages.chatbot.thinking}
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-y-3">
      {(product.variants?.length ?? 0) > 1 && (
        <div className="flex flex-col gap-y-3">
          {(product.options || []).map((option) => (
            <OptionSelect
              key={option.id}
              option={option}
              current={options[option.id]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              disabled={isAdding}
            />
          ))}
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || isAdding || !isValidVariant || isSuccess}
        variant="primary"
        className="h-9 w-full !rounded-none !border-[var(--rm-primary)] !bg-[var(--rm-primary)] text-xs !text-white hover:!border-[var(--rm-primary-hover)] hover:!bg-[var(--rm-primary-hover)]"
        isLoading={isAdding}
      >
        {isSuccess
          ? messages.common.addedToCart
          : !selectedVariant
          ? messages.common.selectVariant
          : !inStock
          ? messages.common.outOfStock
          : messages.common.addToCart}
      </Button>
    </div>
  )
}
