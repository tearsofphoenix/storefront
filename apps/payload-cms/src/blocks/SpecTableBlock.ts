import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const SpecTableBlock: Block = {
  slug: 'spec-table',
  labels: {
    singular: 'Spec Table',
    plural: 'Spec Tables',
  },
  admin: {
    images: createBlockImages({
      label: 'Specs',
      accent: '#6A867A',
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
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
