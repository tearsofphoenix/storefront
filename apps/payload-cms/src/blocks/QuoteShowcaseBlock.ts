import type { Block } from 'payload'

import { anchorIdField } from './shared'

export const QuoteShowcaseBlock: Block = {
  slug: 'quote-showcase',
  labels: {
    singular: 'Quote Showcase',
    plural: 'Quote Showcases',
  },
  fields: [
    anchorIdField,
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'highlight',
      type: 'text',
    },
  ],
}
