import type { Block } from 'payload'

import { anchorIdField } from './shared'

export const FaqGroupsBlock: Block = {
  slug: 'faq-groups',
  labels: {
    singular: 'FAQ Groups',
    plural: 'FAQ Groups',
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
      name: 'groups',
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
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
            },
            {
              name: 'answer',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
