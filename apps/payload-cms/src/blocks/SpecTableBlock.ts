import type { Block } from 'payload'

export const SpecTableBlock: Block = {
  slug: 'spec-table',
  labels: {
    singular: 'Spec Table',
    plural: 'Spec Tables',
  },
  fields: [
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
