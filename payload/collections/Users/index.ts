import type { CollectionConfig, PayloadRequest } from 'payload'

import {
  checkFieldPermission,
  checkFieldPermissionOrIf,
  checkPermission,
  checkPermissionOrWhere
} from "@/payload/access/checkPermission";

const whereMyself = (payloadreq: PayloadRequest)=> {
  if (payloadreq.user)
    return {id: {equals: payloadreq.user.id}}
  else
    return false
}

export const Users: CollectionConfig = {
  // populated by payload-authjs-custom
  slug: "users",
  admin: {
    useAsTitle: "email",
    components: {
      afterList: ['@/payload/collections/Users/generatePDFserver#GeneratePDFButtonServer'],
    }
  },
  access: {
    create: () => false,
    read: checkPermissionOrWhere("view:users",whereMyself),
    readVersions: () => false,
    update: checkPermissionOrWhere("update:users",whereMyself),
    delete: checkPermissionOrWhere("remove:users",whereMyself),
    unlock: checkPermission("update:users"),
    // admin: Maybe make more restrictive than authenticated
  },
  fields: [
    {
      name: "role",
      type: "text",
      label: "Role",
      access:{
        create: () => false,
        read: checkFieldPermissionOrIf("view:users",({id,req:{user}}) => (user ? id === user.id : false )),
        update: checkFieldPermission("update:user:role")
      }
    },
    // Overrides plugin defaults (access)
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [{
            type: "row",
            fields: [
              {
                name: "email",
                type: "email",
                access:{
                  create: () => false,
                  read: checkFieldPermissionOrIf("view:users",({id,req:{user}}) => (user ? id === user.id : false )),
                  update: checkFieldPermission("update:users")
                }
              },
              {
                name: "emailVerified",
                type: "date",
                access:{
                  create: () => false,
                  read: checkFieldPermissionOrIf("view:users",({id,req:{user}}) => (user ? id === user.id : false )),
                  update: () => false,
                }
              },
            ],
          }],
        }
      ]
    }
    // {
    //   name: "notificationSubscription",
    //   type:
    // }
  ],
}
