import type { Block } from 'payload'

import { anchorIdField } from './shared'

export const StatStripBlock: Block = {
  slug: 'stat-strip',
  labels: {
    singular: 'Stat Strip',
    plural: 'Stat Strips',
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
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
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
