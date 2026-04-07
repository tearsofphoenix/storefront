import type { Block } from 'payload'

export const SectionNavBlock: Block = {
  slug: 'section-nav',
  labels: {
    singular: 'Section Nav',
    plural: 'Section Nav Blocks',
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
