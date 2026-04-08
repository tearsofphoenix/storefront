import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const ComparisonTableBlock: Block = {
  slug: 'comparison-table',
  labels: {
    singular: 'Comparison Table',
    plural: 'Comparison Tables',
  },
  admin: {
    images: createBlockImages({
      label: 'Compare',
      accent: '#7E8E79',
      layout: 'table',
    }),
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
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'leftColumnLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'rightColumnLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'leftValue',
          type: 'text',
          required: true,
        },
        {
          name: 'rightValue',
          type: 'text',
          required: true,
        },
        {
          name: 'emphasis',
          type: 'select',
          defaultValue: 'none',
          options: [
            {
              label: 'None',
              value: 'none',
            },
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
      ],
    },
  ],
}
