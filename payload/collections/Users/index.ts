import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  // populated by payload-authjs-custom
  slug: "users",
  fields: [
    {
      name: "role",
      type: "text",
      label: "Role"
    },
    // {
    //   name: "notificationSubscription",
    //   type:
    // }
  ],
}
