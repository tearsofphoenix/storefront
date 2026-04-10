import { Badge } from "@medusajs/ui"
import { useI18n } from "@lib/i18n/use-i18n"

const PaymentTest = ({ className }: { className?: string }) => {
  const { messages } = useI18n()

  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">{messages.common.attention}:</span>{" "}
      {messages.common.testingPurposeOnly}
    </Badge>
  )
}

export default PaymentTest
