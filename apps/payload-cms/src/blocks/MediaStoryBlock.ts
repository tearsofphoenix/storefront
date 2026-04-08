import type { Block } from 'payload'

import { anchorIdField, createBlockImages } from './shared'

export const MediaStoryBlock: Block = {
  slug: 'media-story',
  labels: {
    singular: 'Media Story',
    plural: 'Media Stories',
  },
  admin: {
    images: createBlockImages({
      label: 'Story',
      accent: '#8E6E55',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'mediaPosition',
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
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
