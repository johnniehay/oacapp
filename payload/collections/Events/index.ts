import type { CollectionConfig } from "payload";
import { authenticated } from "@/payload/access/authenticated";
import { anyone } from "@/payload/access/anyone";

export const Events: CollectionConfig<"event"> = {
  slug: "event",

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "start", type: "date", required: true, admin:{date:{pickerAppearance: "dayAndTime",displayFormat:"EEE do MMM HH:mm"}} },
    { name: "end", type: "date", required: true, admin:{date:{pickerAppearance: "dayAndTime",displayFormat:"EEE do MMM HH:mm"}} },
    { name: "eventType", type: "select",required:true,options:["robotgame","judging","cultural","general"]},
    { name: "description", type: "text" },
    { name: "location", type: "text" },
    { name: "forAll", type: "select",options:["teams","volunteers"], hasMany:true },
    { name: "teams", type: "relationship", relationTo:"team", hasMany:true },
  ]
}