import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ Blocks',
  },
  admin: {
    images: createBlockImages({
      label: 'FAQ',
      accent: '#68837A',
      layout: 'table',
    }),
  },
  fields: [
    anchorIdField,
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
