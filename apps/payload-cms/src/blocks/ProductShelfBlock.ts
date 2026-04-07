import type { Block } from 'payload'

import { anchorIdField } from './shared'

export const ProductShelfBlock: Block = {
  slug: 'product-shelf',
  labels: {
    singular: 'Product Shelf',
    plural: 'Product Shelves',
  },
  fields: [
    anchorIdField,
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'productHandle',
          type: 'text',
          required: true,
          admin: {
            description: '填写 Medusa 商品 handle，例如 remarkable-paper-pro。',
          },
        },
        {
          name: 'badge',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
