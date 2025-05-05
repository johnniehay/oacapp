import type { CollectionConfig } from "payload";
import { checkPermission } from "@/payload/access/checkPermission";
import { anyone } from "@/payload/access/anyone";

export const Events: CollectionConfig<"event"> = {
  slug: "event",

  access: {
    create: checkPermission("create:event"),
    delete: checkPermission("remove:event"),
    read: anyone,
    update: checkPermission("update:event"),
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "start", type: "date", required: true, admin:{date:{pickerAppearance: "dayAndTime",displayFormat:"EEE do MMM HH:mm"}} },
    { name: "end", type: "date", required: true, admin:{date:{pickerAppearance: "dayAndTime",displayFormat:"EEE do MMM HH:mm"}} },
    { name: "eventType", type: "select",required:true,options:["robotgame","judging","robotgame-queue","judging-queue","cultural","general"]},
    { name: "description", type: "text" },
    { name: "location", type: "relationship", relationTo: "location" },
    { name: "forAll", type: "select",options:["teams","volunteers"], hasMany:true },
    { name: "teams", type: "relationship", relationTo:"team", hasMany:true },
  ]
}