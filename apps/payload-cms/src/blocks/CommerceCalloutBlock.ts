import type { Block } from 'payload'

import { anchorIdField } from './shared'

export const CommerceCalloutBlock: Block = {
  slug: 'commerce-callout',
  labels: {
    singular: 'Commerce Callout',
    plural: 'Commerce Callouts',
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
