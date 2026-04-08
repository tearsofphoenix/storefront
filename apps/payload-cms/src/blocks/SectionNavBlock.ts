import type { Block } from 'payload'

import { createBlockImages } from './shared'

export const SectionNavBlock: Block = {
  slug: 'section-nav',
  labels: {
    singular: 'Section Nav',
    plural: 'Section Nav Blocks',
  },
  admin: {
    images: createBlockImages({
      label: 'Nav',
      accent: '#8A7A60',
      layout: 'nav',
    }),
  },
  fields: [
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
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'anchorId',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
