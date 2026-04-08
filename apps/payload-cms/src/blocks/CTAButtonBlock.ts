import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const CTAButtonBlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA',
    plural: 'CTA Blocks',
  },
  admin: {
    images: createBlockImages({
      label: 'CTA',
      accent: '#9F6A3B',
      layout: 'cta',
    }),
  },
  fields: [
    anchorIdField,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'primaryCTA',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
  ],
}
