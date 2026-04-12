"use client"

import { useEffect, useMemo, useState } from "react"
import { useExpressCart } from "@providers/express-cart"
import { StepCard } from "./step-card"
import { useExpressRegion } from "@providers/express-region"
import { Button, Input, Select } from "@medusajs/ui"
import { useI18n } from "@lib/i18n/use-i18n"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter } from "next/navigation"

type AddressCardProps = {
  handle: string
  isActive: boolean
  basePath: string
}

export const AddressCard = ({
  handle,
  isActive,
  basePath
}: AddressCardProps) => {
  const { cart, updateCart } = useExpressCart()
  const { region } = useExpressRegion()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState(cart?.shipping_address?.first_name || "")
  const [lastName, setLastName] = useState(cart?.shipping_address?.last_name || "")
  const [email, setEmail] = useState(cart?.email || "")
  const [phone, setPhone] = useState(cart?.shipping_address?.phone || "")
  const [address, setAddress] = useState(cart?.shipping_address?.address_1 || "")
  const [postalCode, setPostalCode] = useState(cart?.shipping_address?.postal_code || "")
  const [city, setCity] = useState(cart?.shipping_address?.city || "")
  const [country, setCountry] = useState(cart?.shipping_address?.country_code || region?.countries?.[0]?.iso_2 || "")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const { messages } = useI18n()

  useEffect(() => {
    setFirstName((prev) => prev || cart?.shipping_address?.first_name || "")
    setLastName((prev) => prev || cart?.shipping_address?.last_name || "")
    setEmail((prev) => prev || cart?.email || "")
    setPhone((prev) => prev || cart?.shipping_address?.phone || "")
    setAddress((prev) => prev || cart?.shipping_address?.address_1 || "")
    setPostalCode((prev) => prev || cart?.shipping_address?.postal_code || "")
    setCity((prev) => prev || cart?.shipping_address?.city || "")
    setCountry(
      (prev) =>
        prev ||
        cart?.shipping_address?.country_code ||
        region?.countries?.[0]?.iso_2 ||
        ""
    )
  }, [cart, region])

  const isButtonDisabled = useMemo(() => {
    return loading || !firstName || !lastName || !email || !phone || !address || !postalCode || !city || !country
  }, [firstName, lastName, email, phone, address, postalCode, city, country, loading])

  const handleSubmit = () => {
    if (isButtonDisabled) return

    setLoading(true)
    setErrorMessage("")

    updateCart({
      updateData: {
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          phone,
          address_1: address,
          postal_code: postalCode,
          city,
          country_code: country,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          phone,
          address_1: address,
          postal_code: postalCode,
          city,
          country_code: country,
        },
        email,
      },
    })
      .then(() => {
        router.push(`${basePath}?step=shipping`)
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : messages.common.genericErrorRetry
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <StepCard
      title={messages.common.deliveryAddress}
      isActive={isActive}
      isDone={!!cart?.shipping_address}
      path={`${basePath}?step=address`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs">{messages.common.contact}</span>
          <div className="flex gap-2">
            <Input
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={messages.common.firstName}
            />
            <Input
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={messages.common.lastName}
            />
          </div>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={messages.common.email}
          />
          <Input
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={messages.common.phone}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs">{messages.common.delivery}</span>
          <Input
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={messages.common.address}
          />
          <div className="flex gap-2">
            <Input
              name="postal_code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder={messages.common.postalCode}
            />
            <Input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={messages.common.city}
            />
          </div>
          <Select
            value={country}
            onValueChange={(value) => setCountry(value)}
          >
            <Select.Trigger>
              <Select.Value placeholder={messages.common.country} />
            </Select.Trigger>
            <Select.Content>
              {region?.countries?.map((c) => (
                <Select.Item key={c.iso_2} value={c.iso_2 || ""}>
                  {c.display_name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <ErrorMessage error={errorMessage} data-testid="express-address-error" />
        <hr className="bg-ui-bg-subtle" />
        <Button
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className="w-full"
        >
          {messages.common.continue}
        </Button>
      </div>
    </StepCard>
  )
}
