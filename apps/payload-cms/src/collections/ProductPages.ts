import type { CollectionConfig } from 'payload'

import { BenefitStripBlock } from '@/blocks/BenefitStripBlock'
import { BundleGridBlock } from '@/blocks/BundleGridBlock'
import { CTAButtonBlock } from '@/blocks/CTAButtonBlock'
import { CommerceCalloutBlock } from '@/blocks/CommerceCalloutBlock'
import { ComparisonTableBlock } from '@/blocks/ComparisonTableBlock'
import { FAQBlock } from '@/blocks/FAQBlock'
import { FaqGroupsBlock } from '@/blocks/FaqGroupsBlock'
import { FeatureGridBlock } from '@/blocks/FeatureGridBlock'
import { HeroBlock } from '@/blocks/HeroBlock'
import { MediaStoryBlock } from '@/blocks/MediaStoryBlock'
import { ProductShelfBlock } from '@/blocks/ProductShelfBlock'
import { QuoteShowcaseBlock } from '@/blocks/QuoteShowcaseBlock'
import { SectionNavBlock } from '@/blocks/SectionNavBlock'
import { SpecTableBlock } from '@/blocks/SpecTableBlock'
import { StatStripBlock } from '@/blocks/StatStripBlock'
import {
  revalidateProductPageAfterChange,
  revalidateProductPageAfterDelete,
} from '@/hooks/revalidate-storefront'

export const ProductPages: CollectionConfig = {
  slug: 'product-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'status', 'syncStatus', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateProductPageAfterChange],
    afterDelete: [revalidateProductPageAfterDelete],
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
      name: 'medusaProductId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'handle',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'syncStatus',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Deleted in Medusa',
          value: 'deleted',
        },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'medusaSummary',
      type: 'group',
      admin: {
        description: '这部分由 Medusa 自动同步，用于帮助内容编辑识别商品。',
      },
      fields: [
        {
          name: 'productTitle',
          type: 'text',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'thumbnail',
          type: 'text',
        },
        {
          name: 'productStatus',
          type: 'text',
        },
        {
          name: 'collectionTitle',
          type: 'text',
        },
        {
          name: 'tags',
          type: 'json',
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
        SectionNavBlock,
        HeroBlock,
        BenefitStripBlock,
        CommerceCalloutBlock,
        StatStripBlock,
        FeatureGridBlock,
        MediaStoryBlock,
        ComparisonTableBlock,
        ProductShelfBlock,
        BundleGridBlock,
        QuoteShowcaseBlock,
        SpecTableBlock,
        FaqGroupsBlock,
        FAQBlock,
        CTAButtonBlock,
      ],
    },
  ],
  timestamps: true,
}
