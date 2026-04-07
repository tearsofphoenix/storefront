"use client"

import { Table } from "@medusajs/ui"
import { useI18n } from "@lib/i18n/use-i18n"
import { DigitalProduct } from "../../../../types/global"

type Props = {
  digitalProducts: DigitalProduct[]
}

export const DigitalProductsList = ({
  digitalProducts,
}: Props) => {
  const { messages } = useI18n()

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{messages.common.name}</Table.HeaderCell>
          <Table.HeaderCell>{messages.common.action}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {digitalProducts.map((digitalProduct) => {
          const medias =
            digitalProduct.medias?.filter((media) => media.type === "main") ?? []
          const showMediaCount = (medias?.length || 0) > 1
          return (
            <Table.Row key={digitalProduct.id}>
              <Table.Cell>
                {digitalProduct.name}
              </Table.Cell>
              <Table.Cell>
                <ul>
                  {medias?.map((media, index) => (
                    <li key={media.id}>
                      <a href={media.url ?? "#"}>
                        {messages.common.download}
                        {showMediaCount ? ` ${index + 1}` : ``}
                      </a>
                    </li>
                  ))}
                </ul>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}
