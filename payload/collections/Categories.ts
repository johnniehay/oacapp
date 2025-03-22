import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { checkPermission } from "@/payload/access/checkPermission";
import { slugField } from '@/payload/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: checkPermission("admin"),
    delete: checkPermission("admin"),
    read: anyone,
    update: checkPermission("admin"),
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
