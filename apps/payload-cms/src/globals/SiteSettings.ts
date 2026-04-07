import type { GlobalConfig } from 'payload'

import { revalidateSiteSettingsAfterChange } from '@/hooks/revalidate-storefront'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSiteSettingsAfterChange],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Panda AI Store',
    },
    {
      name: 'announcementBar',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'linkLabel',
          type: 'text',
        },
        {
          name: 'linkHref',
          type: 'text',
        },
      ],
    },
    {
      name: 'defaultSeo',
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
  ],
}
