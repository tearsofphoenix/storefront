"use client"

import { HttpTypes } from "@medusajs/types"
import { Button, Input, Select } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { sdk } from "@lib/config"
import { useExpressRegion } from "@providers/express-region"
import { Spinner } from "@medusajs/icons"
import { useExpressCart } from "@providers/express-cart"
import { useRouter } from "next/navigation"
import { StepCard } from "./step-card"
import { convertToLocale } from "@lib/util/money"
import { useI18n } from "@lib/i18n/use-i18n"
import ErrorMessage from "@modules/checkout/components/error-message"
import Thumbnail from "@modules/products/components/thumbnail"

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, option: any) => {
    if (option.option_id && option.id) {
      acc[option.option_id] = option.id
    }
    return acc
  }, {})
}

type ProductCardProps = {
  handle: string
  isActive: boolean
  basePath: string
}

export const ProductCard = ({ handle, isActive, basePath }: ProductCardProps) => {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<HttpTypes.StoreProduct>()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [errorMessage, setErrorMessage] = useState("")
  const { region } = useExpressRegion()
  const { cart, addToCart } = useExpressCart()
  const router = useRouter()
  const { messages, t } = useI18n()

  useEffect(() => {
    if (!region) {
      return
    }

    setLoading(true)
    setErrorMessage("")

    sdk.store.product
      .list({
        handle,
        region_id: region.id,
        fields: `*variants.calculated_price,+variants.inventory_quantity`,
      })
      .then(({ products }) => {
        if (products.length) {
          setProduct(products[0])
        } else {
          setProduct(undefined)
          setErrorMessage(messages.common.productNotFound)
        }
        setLoading(false)
      })
      .catch(() => {
        setProduct(undefined)
        setErrorMessage(messages.common.genericErrorRetry)
        setLoading(false)
      })
  }, [handle, messages.common.genericErrorRetry, messages.common.productNotFound, region])

  useEffect(() => {
    if (product?.variants?.length !== 1) {
      return
    }

    const variantOptions = optionsAsKeymap(product.variants[0].options)
    setSelectedOptions(variantOptions ?? {})
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) {
      return
    }

    if (!product.options?.length) {
      return product.variants[0]
    }

    if (Object.keys(selectedOptions).length !== product.options.length) {
      return
    }

    return product.variants.find((variant) =>
      variant.options?.every(
        (optionValue) =>
          optionValue.id === selectedOptions[optionValue.option_id!]
      )
    )
  }, [selectedOptions, product])

  const price = useMemo(() => {
    const selectedVariantPrice = selectedVariant ||
      product?.variants?.sort((a: HttpTypes.StoreProductVariant, b: HttpTypes.StoreProductVariant) => {
        if (!a.calculated_price?.calculated_amount && !b.calculated_price?.calculated_amount) return 0
        if (!a.calculated_price?.calculated_amount) return 1
        if (!b.calculated_price?.calculated_amount) return -1
        return a.calculated_price!.calculated_amount - b.calculated_price!.calculated_amount
      })[0]

    return convertToLocale({
      amount: selectedVariantPrice?.calculated_price?.calculated_amount || 0,
      currency_code: region?.currency_code
    })
  }, [selectedVariant, product, region])

  const isInStock = useMemo(() => {
    if (!selectedVariant) return undefined
    return selectedVariant.manage_inventory === false || (selectedVariant.inventory_quantity || 0) > 0
  }, [selectedVariant])

  const handleAddToCart = () => {
    if (!selectedVariant || !isInStock || !quantity) return
    setIsSubmitting(true)
    setErrorMessage("")

    addToCart(selectedVariant.id!, quantity)
      .then(() => {
        router.push(`${basePath}?step=address`)
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : messages.common.genericErrorRetry
        )
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <StepCard
      title={messages.common.product}
      isActive={isActive}
      isDone={!!cart?.items?.length}
      path={basePath}
    >
      {loading && <Spinner />}
      {!loading && !product && (
        <div className="text-sm text-ui-fg-subtle">
          {errorMessage || messages.common.productNotFound}
        </div>
      )}
      {!loading && product && (
        <div className="flex gap-4 flex-col">
          <div className="flex gap-4">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              className="w-40 p-0"
              size="square"
              alt={product.title}
            />
            <div className="flex flex-col gap-1">
              {product.categories?.length && (
                <span className="text-xs text-ui-fg-muted">
                  {product.categories[0].name}
                </span>
              )}
              <span className="text-base text-ui-fg-base">{product.title}</span>
              <span className="text-sm text-ui-fg-subtle">{price}</span>
            </div>
          </div>
          <p className="text-sm text-ui-fg-subtle">{product.description}</p>
          {product.options?.map((option) => (
            <div className="flex flex-col gap-1" key={option.id}>
              <span className="text-xs text-ui-fg-muted">{option.title}</span>
              <Select
                onValueChange={(value) => {
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [option.id!]: value,
                  }))
                }}
                value={selectedOptions[option.id!]}
              >
                <Select.Trigger>
                  <Select.Value
                    placeholder={t(messages.common.selectNamedOption, {
                      name: option.title ?? messages.common.selectPlaceholder,
                    })}
                  />
                </Select.Trigger>
                <Select.Content>
                  {option.values?.map((value) => (
                    <Select.Item key={value.id} value={value.id}>
                      {value.value}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-ui-fg-muted">
              {messages.common.quantity}
            </span>
            <Input
              name="quantity"
              placeholder={messages.common.quantity}
              type="number"
              min="1"
              max={selectedVariant?.inventory_quantity || undefined}
              value={quantity}
              onChange={(e) => {
                const nextQuantity = Number(e.target.value)

                if (Number.isNaN(nextQuantity)) {
                  setQuantity(1)
                  return
                }

                setQuantity(Math.max(1, nextQuantity))
              }}
            />
          </div>
          <hr className="bg-ui-bg-subtle" />
          <ErrorMessage
            error={errorMessage}
            data-testid="express-product-error"
          />
          <Button
            disabled={!selectedVariant || !isInStock || loading || isSubmitting}
            onClick={handleAddToCart}
            isLoading={isSubmitting}
            className="w-full"
          >
            {!selectedVariant && messages.common.selectOptions}
            {selectedVariant && !isInStock && messages.common.outOfStock}
            {selectedVariant && isInStock && messages.common.addToCart}
          </Button>
        </div>
      )}
    </StepCard>
  )
}
