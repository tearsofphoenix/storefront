"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { sdk } from "@lib/config"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { useI18n } from "@lib/i18n/use-i18n"
import { convertToLocale } from "@lib/util/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import MedusaRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ECPayMapSelector from "../ecpay-map"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"
const ECPAY_PROVIDER_IDS = new Set([
  "ecpay-logistics",
  "ecpay-logistics_ecpay-logistics",
])

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

type PickupLocationAddress = {
  address_1?: string | null
  address_2?: string | null
  postal_code?: string | null
  city?: string | null
  country_code?: string | null
}

type PickupCapableShippingOption = HttpTypes.StoreCartShippingOption & {
  service_zone?: {
    fulfillment_set?: {
      type?: string | null
      location?: {
        address?: PickupLocationAddress | null
      } | null
    } | null
  } | null
}

type EcpayPublicSettings = {
  merchant_id: string
  is_test: boolean
  is_configured: boolean
}

type EcpayPublicSettingsResponse = {
  settings: EcpayPublicSettings
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

function getFulfillmentType(option: HttpTypes.StoreCartShippingOption) {
  return (option as PickupCapableShippingOption).service_zone?.fulfillment_set?.type
}

function getPickupAddress(option: HttpTypes.StoreCartShippingOption) {
  return (option as PickupCapableShippingOption).service_zone?.fulfillment_set?.location?.address
}

function getEcpayLogisticsSubType(name?: string | null) {
  const normalizedName = name?.toUpperCase() ?? ""
  const isC2C =
    normalizedName.includes("C2C") ||
    normalizedName.includes("STORE TO STORE") ||
    Boolean(name?.includes("店到店")) ||
    Boolean(name?.includes("取貨付款"))

  if (normalizedName.includes("FAMI") || name?.includes("全家")) {
    return isC2C ? "FAMIC2C" : "FAMI"
  }

  if (normalizedName.includes("HILIFE") || name?.includes("萊爾富")) {
    return isC2C ? "HILIFEC2C" : "HILIFE"
  }

  if (normalizedName.includes("OK")) {
    return "OKMARTC2C"
  }

  return isC2C ? "UNIMARTC2C" : "UNIMART"
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const { messages } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [ecpaySettings, setEcpaySettings] = useState<EcpayPublicSettings | null>(
    null
  )
  const [isLoadingEcpaySettings, setIsLoadingEcpaySettings] = useState(false)
  const [ecpaySettingsError, setEcpaySettingsError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => getFulfillmentType(sm) !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => getFulfillmentType(sm) === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length
  const hasShippingOptions = !!_shippingMethods?.length
  const hasAnyDeliveryOptions = hasPickupOptions || hasShippingOptions
  const hasEcpayOption = [...(_shippingMethods || []), ...(_pickupMethods || [])].some(
    (option) => ECPAY_PROVIDER_IDS.has(option.provider_id ?? "")
  )

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [_pickupMethods, _shippingMethods, cart.id, shippingMethodId])

  useEffect(() => {
    let isActive = true

    if (!hasEcpayOption) {
      setEcpaySettings(null)
      setEcpaySettingsError(null)
      setIsLoadingEcpaySettings(false)
      return () => {
        isActive = false
      }
    }

    const loadEcpaySettings = async () => {
      setIsLoadingEcpaySettings(true)
      setEcpaySettingsError(null)

      try {
        const response = await sdk.client.fetch<EcpayPublicSettingsResponse>(
          "/store/ecpay/settings",
          {
            method: "GET",
          }
        )

        if (!isActive) {
          return
        }

        setEcpaySettings(response.settings)
      } catch (err) {
        if (!isActive) {
          return
        }

        setEcpaySettings(null)
        setEcpaySettingsError(
          err instanceof Error ? err.message : "Failed to load ECPay settings"
        )
      } finally {
        if (isActive) {
          setIsLoadingEcpaySettings(false)
        }
      }
    }

    void loadEcpaySettings()

    return () => {
      isActive = false
    }
  }, [hasEcpayOption])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup",
    data?: Record<string, any>
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id, data })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    const cvsStoreId = searchParams.get("cvsStoreId")
    if (cvsStoreId && shippingMethodId) {
      const cvsStoreName = searchParams.get("cvsStoreName")
      const cvsAddress = searchParams.get("cvsAddress")
      const cvsTelephone = searchParams.get("cvsTelephone")
      const logisticsSubType = searchParams.get("logisticsSubType")
      
      const variant = _pickupMethods?.some(m => m.id === shippingMethodId) ? "pickup" : "shipping"
      
      handleSetShippingMethod(shippingMethodId, variant, {
        CVSStoreID: cvsStoreId,
        CVSStoreName: cvsStoreName,
        CVSAddress: cvsAddress,
        CVSTelephone: cvsTelephone,
        LogisticsSubType: logisticsSubType
      }).then(() => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete("cvsStoreId")
        newParams.delete("cvsStoreName")
        newParams.delete("cvsAddress")
        newParams.delete("cvsTelephone")
        newParams.delete("logisticsSubType")
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, shippingMethodId])

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const selectedOption = [...(_shippingMethods || []), ...(_pickupMethods || [])].find(
    (o) => o.id === shippingMethodId
  )
  const isECPaySelected = ECPAY_PROVIDER_IDS.has(selectedOption?.provider_id ?? "")
  const selectedShippingMethodData = cart.shipping_methods?.[0]?.data
  const hasSelectedStore = Boolean(selectedShippingMethodData?.CVSStoreID)
  const hasConfiguredEcpaySettings = Boolean(
    ecpaySettings?.is_configured && ecpaySettings.merchant_id
  )
  const mapReplyUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  }/api/ecpay/map-reply`
  const mapReturnPath = `${pathname}?step=delivery`

  return (
    <section className="rounded-[18px] border border-[#e5e7eb] bg-white px-6 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] small:px-8 small:py-8">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          {messages.common.delivery}
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-delivery-button"
              >
                {messages.common.edit}
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <div className="grid gap-6">
          <div className="grid">
            <div className="flex flex-col">
              <span className="font-medium txt-medium text-ui-fg-base">
                {messages.common.shippingMethod}
              </span>
              <span className="mb-4 text-ui-fg-muted txt-medium">
                {messages.common.deliveryPrompt}
              </span>
            </div>
            <div data-testid="delivery-options-container">
              <div className="pt-2 md:pt-0">
                {!hasAnyDeliveryOptions && (
                  <div className="rounded-rounded border border-ui-border-base bg-ui-bg-subtle px-6 py-5">
                    <Text className="txt-medium-plus text-ui-fg-base">
                      {messages.common.shippingMethodUnavailable}
                    </Text>
                    <Text className="mt-2 txt-medium text-ui-fg-muted">
                      {messages.common.shippingMethodUnavailableHint}
                    </Text>
                  </div>
                )}
                {hasPickupOptions && (
                  <RadioGroup
                    value={showPickupOptions}
                    onChange={(value) => {
                      const id = _pickupMethods.find(
                        (option) => !option.insufficient_inventory
                      )?.id

                      if (id) {
                        handleSetShippingMethod(id, "pickup")
                      }
                    }}
                  >
                    <Radio
                      value={PICKUP_OPTION_ON}
                      data-testid="delivery-option-radio"
                      className={clx(
                        "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                        {
                          "border-ui-border-interactive":
                            showPickupOptions === PICKUP_OPTION_ON,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <MedusaRadio
                          checked={showPickupOptions === PICKUP_OPTION_ON}
                        />
                        <span className="text-base-regular">
                          {messages.common.pickupOrder}
                        </span>
                      </div>
                      <span className="justify-self-end text-ui-fg-base">
                        -
                      </span>
                    </Radio>
                  </RadioGroup>
                )}
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "shipping")
                    }
                  }}
                >
                  {_shippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <div key={option.id} className="flex flex-col mb-2">
                        <Radio
                          value={option.id}
                          data-testid="delivery-option-radio"
                          disabled={isDisabled}
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 hover:shadow-borders-interactive-with-active",
                            {
                              "border-ui-border-interactive":
                                option.id === shippingMethodId,
                              "hover:shadow-brders-none cursor-not-allowed":
                                isDisabled,
                            }
                          )}
                        >
                          <div className="flex items-center gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <span className="text-base-regular">
                              {option.name}
                            </span>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            {option.price_type === "flat" ? (
                              convertToLocale({
                                amount: option.amount!,
                                currency_code: cart?.currency_code,
                              })
                            ) : calculatedPricesMap[option.id] ? (
                              convertToLocale({
                                amount: calculatedPricesMap[option.id],
                                currency_code: cart?.currency_code,
                              })
                            ) : isLoadingPrices ? (
                              <Loader />
                            ) : (
                              "-"
                            )}
                          </span>
                        </Radio>
                        {option.id === shippingMethodId &&
                          ECPAY_PROVIDER_IDS.has(option.provider_id ?? "") && (
                          <div className="w-full mt-2 pl-8 pr-4 mb-2">
                            {selectedShippingMethodData?.CVSStoreID && (
                              <div className="mb-4 rounded-md border border-[#e5e7eb] bg-[#f8fafc] p-4">
                                <Text className="mb-1 font-semibold text-ui-fg-base">
                                  {String(selectedShippingMethodData.CVSStoreName)} (
                                  {String(selectedShippingMethodData.CVSStoreID)})
                                </Text>
                                <Text className="mb-3 text-sm text-ui-fg-subtle">
                                  {String(selectedShippingMethodData.CVSAddress)}
                                </Text>
                              </div>
                            )}

                            {isLoadingEcpaySettings ? (
                              <Text className="text-sm text-ui-fg-subtle">
                                Loading ECPay pickup settings...
                              </Text>
                            ) : ecpaySettingsError ? (
                              <Text className="text-sm text-rose-600">
                                {ecpaySettingsError}
                              </Text>
                            ) : hasConfiguredEcpaySettings && ecpaySettings ? (
                              <ECPayMapSelector
                                merchantId={ecpaySettings.merchant_id}
                                isTest={ecpaySettings.is_test}
                                logisticsSubType={getEcpayLogisticsSubType(option.name)}
                                serverReplyUrl={mapReplyUrl}
                                returnPath={mapReturnPath}
                                disabled={isLoading}
                              />
                            ) : (
                              <Text className="text-sm text-rose-600">
                                ECPay pickup is not configured yet.
                              </Text>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="grid">
              <div className="flex flex-col">
                <span className="font-medium txt-medium text-ui-fg-base">
                  {messages.common.storeLabel}
                </span>
                <span className="mb-4 text-ui-fg-muted txt-medium">
                  {messages.common.chooseStoreNearYou}
                </span>
              </div>
              <div data-testid="delivery-options-container">
                <div className="pb-8 md:pt-0 pt-2">
                  <RadioGroup
                    value={shippingMethodId}
                    onChange={(v) => {
                      if (v) {
                        return handleSetShippingMethod(v, "pickup")
                      }
                    }}
                  >
                    {_pickupMethods?.map((option) => {
                      return (
                        <Radio
                          key={option.id}
                          value={option.id}
                          disabled={option.insufficient_inventory}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                            {
                              "border-ui-border-interactive":
                                option.id === shippingMethodId,
                              "hover:shadow-brders-none cursor-not-allowed":
                                option.insufficient_inventory,
                            }
                          )}
                        >
                          <div className="flex items-start gap-x-4">
                            <MedusaRadio
                              checked={option.id === shippingMethodId}
                            />
                            <div className="flex flex-col">
                              <span className="text-base-regular">
                                {option.name}
                              </span>
                              <span className="text-base-regular text-ui-fg-muted">
                                {formatAddress(
                                  getPickupAddress(option) as HttpTypes.StoreCartAddress
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            {convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })}
                          </span>
                        </Radio>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            {isECPaySelected && !hasSelectedStore && (
              <Text className="text-rose-500 txt-medium mb-4">
                {"Please select a store using the map selector before continuing."}
              </Text>
            )}
            <Button
              size="large"
              className="mt"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                !cart.shipping_methods?.[0] || 
                (isECPaySelected && !hasSelectedStore)
              }
              data-testid="submit-delivery-option-button"
            >
              {messages.common.continueToPayment}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {messages.common.method}
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods!.at(-1)!.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods!.at(-1)!.amount!,
                    currency_code: cart?.currency_code,
                  })}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Shipping
