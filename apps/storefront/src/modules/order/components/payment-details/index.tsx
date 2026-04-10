import { Container, Heading, Text } from "@medusajs/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Payment
      </Heading>
      <div>
        {payment && (
          <div className="grid w-full gap-6 small:grid-cols-[0.8fr_1.2fr]">
            <div className="rm-panel-soft flex flex-col p-4">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id]?.title || payment.provider_id}
              </Text>
            </div>
            <div className="rm-panel-soft flex flex-col p-4">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment details
              </Text>
              <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
                <Container className="flex h-7 w-fit items-center border border-[var(--rm-border)] bg-white p-2 shadow-none">
                  {paymentInfoMap[payment.provider_id]?.icon}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
