import type { Field } from 'payload'

export const anchorIdField: Field = {
  name: 'anchorId',
  type: 'text',
  admin: {
    description: '可选，用于页面内锚点导航，例如 writing-experience。',
  },
}
