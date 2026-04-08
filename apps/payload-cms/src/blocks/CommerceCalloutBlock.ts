import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const CommerceCalloutBlock: Block = {
  slug: 'commerce-callout',
  labels: {
    singular: 'Commerce Callout',
    plural: 'Commerce Callouts',
  },
  admin: {
    images: createBlockImages({
      label: 'Commerce',
      accent: '#9B7C57',
      layout: 'story',
    }),
  },
  fields: [
    anchorIdField,
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'supportingText',
      type: 'textarea',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
    },
    {
      name: 'showImage',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
