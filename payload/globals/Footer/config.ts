import type { GlobalConfig } from 'payload'

import { link } from '@/payload/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { checkPermission } from "@/payload/access/checkPermission";

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: checkPermission("admin"),
    readDrafts: checkPermission("all:pages"),
    readVersions: checkPermission("all:pages")
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/globals/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
