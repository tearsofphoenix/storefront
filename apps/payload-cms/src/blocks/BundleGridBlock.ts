import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const BundleGridBlock: Block = {
  slug: 'bundle-grid',
  labels: {
    singular: 'Bundle Grid',
    plural: 'Bundle Grids',
  },
  admin: {
    images: createBlockImages({
      label: 'Bundles',
      accent: '#C08E3E',
      layout: 'products',
    }),
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
      name: 'bundles',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'productHandle',
          type: 'text',
          required: true,
          admin: {
            description: '填写 Medusa 商品 handle，例如 remarkable-paper-pro-bundle。',
          },
        },
        {
          name: 'badge',
          type: 'text',
        },
        {
          name: 'highlight',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'ctaLabel',
          type: 'text',
        },
      ],
    },
  ],
}
