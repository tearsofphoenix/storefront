"use client"

import { useI18n } from "@lib/i18n/use-i18n"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { messages } = useI18n()
  const tabs = [
    {
      label: messages.product.productInformation,
      component: <ProductInfoTab product={product} />,
    },
    {
      label: messages.product.shippingAndReturns,
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const { messages } = useI18n()

  return (
    <div className="py-8 text-small-regular text-grey-70">
      <div className="grid grid-cols-1 gap-8 small:grid-cols-2">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.material}
            </span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.countryOfOrigin}
            </span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.type}
            </span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.weight}
            </span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.dimensions}
            </span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const { messages } = useI18n()

  return (
    <div className="py-8 text-small-regular text-grey-70">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.fastDelivery}
            </span>
            <p className="max-w-sm">{messages.product.fastDeliveryCopy}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.simpleExchanges}
            </span>
            <p className="max-w-sm">{messages.product.simpleExchangesCopy}</p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey-50">
              {messages.product.easyReturns}
            </span>
            <p className="max-w-sm">{messages.product.easyReturnsCopy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
