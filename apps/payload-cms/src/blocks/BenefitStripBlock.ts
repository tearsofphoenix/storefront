import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const BenefitStripBlock: Block = {
  slug: 'benefit-strip',
  labels: {
    singular: 'Benefit Strip',
    plural: 'Benefit Strips',
  },
  admin: {
    images: createBlockImages({
      label: 'Benefit',
      accent: '#B86C52',
      layout: 'grid',
    }),
  },
  fields: [
    anchorIdField,
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
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
