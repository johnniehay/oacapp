import { checkPermission } from "@/payload/access/checkPermission";
import { CollectionConfig } from "payload";


export const Checkins: CollectionConfig<"checkin"> = {
  slug: "checkin",
  access: {
    create: checkPermission("create:checkin"),
    delete: checkPermission("remove:checkin"),
    read: checkPermission("view:checkin"),
    update: checkPermission("update:checkin"),
  },
  fields: [
    { name: "location", type:"relationship", relationTo: "location", required: true },
    { name: "who", type: "text", required: true },
    { name: "team", type: "relationship", relationTo: "team" },
    { name: "person", type: "relationship", relationTo: "people"},
    { name: "user", type:"relationship", relationTo: "users"}
  ],
}