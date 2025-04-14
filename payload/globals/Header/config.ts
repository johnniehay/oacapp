import type { GlobalConfig } from 'payload'

import { link } from '@/payload/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { checkPermission } from "@/payload/access/checkPermission";

export const Header: GlobalConfig = {
  slug: 'header',
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
          RowLabel: '@/payload/globals/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
