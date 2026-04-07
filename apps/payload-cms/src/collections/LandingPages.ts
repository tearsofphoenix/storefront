import type { CollectionConfig } from 'payload'

import { CTAButtonBlock } from '@/blocks/CTAButtonBlock'
import { FAQBlock } from '@/blocks/FAQBlock'
import { FeatureGridBlock } from '@/blocks/FeatureGridBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { MediaStoryBlock } from '@/blocks/MediaStoryBlock'
import { SpecTableBlock } from '@/blocks/SpecTableBlock'
import {
  revalidateLandingPageAfterChange,
  revalidateLandingPageAfterDelete,
} from '@/hooks/revalidate-storefront'

export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateLandingPageAfterChange],
    afterDelete: [revalidateLandingPageAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'sections',
      type: 'blocks',
      blocks: [
        HeroBlock,
        FeatureGridBlock,
        MediaStoryBlock,
        SpecTableBlock,
        FAQBlock,
        CTAButtonBlock,
      ],
    },
  ],
  timestamps: true,
}
