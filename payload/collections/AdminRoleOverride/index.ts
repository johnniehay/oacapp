import { CollectionConfig } from "payload";
import { updateRoleOverridesCache } from "@/lib/get-role";

export const AdminRoleOverride: CollectionConfig = {
  slug: "admin-role-override",
  access: {
    create: () => false,
    delete: () => false,
    update: () => false,
    read: () => false,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo:"users",
      required: true,
      unique: true,
    },
    {
      name: "role",
      type: "text",
      required: true
    }
  ],
  hooks:{
    afterChange: [async ({req:{payload}}) => await updateRoleOverridesCache(payload)]
  }
}