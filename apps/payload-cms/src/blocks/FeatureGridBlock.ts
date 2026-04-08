import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const FeatureGridBlock: Block = {
  slug: 'feature-grid',
  labels: {
    singular: 'Feature Grid',
    plural: 'Feature Grids',
  },
  admin: {
    images: createBlockImages({
      label: 'Features',
      accent: '#738BA4',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
