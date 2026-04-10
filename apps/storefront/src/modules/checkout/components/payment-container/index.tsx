import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"

import { useI18n } from "@lib/i18n/use-i18n"
import Radio from "@modules/common/components/radio"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import {
  LinkAuthenticationElement,
  PaymentElement,
} from "@stripe/react-stripe-js"
import {
  StripeLinkAuthenticationElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "mb-2 flex cursor-pointer flex-col gap-y-2 border px-6 py-4 text-small-regular transition-colors",
        {
          "border-[var(--rm-border-strong)] bg-[var(--rm-surface-soft)]":
            selectedPaymentOptionId === paymentProviderId,
          "border-[var(--rm-border)] bg-[#fff]": selectedPaymentOptionId !== paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <Text className="text-base-regular">
            {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
          </Text>
          {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  defaultEmail,
  setError,
  setPaymentComplete,
  setPaymentType,
}: Omit<PaymentContainerProps, "children"> & {
  defaultEmail?: string | null
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
  setPaymentType: (type: string | null) => void
}) => {
  const stripeReady = useContext(StripeContext)
  const { messages } = useI18n()

  const linkOptions: StripeLinkAuthenticationElementOptions = useMemo(() => {
    return defaultEmail
      ? {
          defaultValues: {
            email: defaultEmail,
          },
        }
      : {}
  }, [defaultEmail])

  const paymentOptions: StripePaymentElementOptions = useMemo(() => {
    return {
      defaultValues: {
        billingDetails: {
          email: defaultEmail ?? undefined,
        },
      },
      fields: {
        billingDetails: {
          address: "if_required",
        },
      },
      layout: {
        type: "accordion",
        defaultCollapsed: false,
        radios: true,
      },
      terms: {
        applePay: "auto",
        card: "auto",
        googlePay: "auto",
      },
      wallets: {
        applePay: "auto",
        googlePay: "auto",
        link: "auto",
      },
    }
  }, [defaultEmail])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 space-y-4 transition-all duration-150 ease-in-out">
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {messages.common.email}
              </Text>
              <div className="border border-[var(--rm-border)] bg-white px-4 py-3">
                <LinkAuthenticationElement options={linkOptions} />
              </div>
            </div>
            <div>
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {messages.common.enterYourPaymentDetails}
              </Text>
              <div className="border border-[var(--rm-border)] bg-white px-4 py-3">
                <PaymentElement
                  options={paymentOptions}
                  onChange={(event) => {
                    setPaymentType(event.value.type || null)
                    setError(null)
                    setPaymentComplete(event.complete)
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
