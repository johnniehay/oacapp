import { CollectionConfig } from "payload";
import { checkPermission } from "@/payload/access/checkPermission";
import { anyone } from "@/payload/access/anyone";

export const Locations: CollectionConfig<"location"> = {
  slug: "location",

  access: {
    create: checkPermission("create:location"),
    delete: checkPermission("remove:location"),
    read: anyone,
    update: checkPermission("update:location"),
  },
  admin: {
    useAsTitle: "name"
  },
  fields: [
    {name:"name", type:"text", required:true, unique:true},
    {name:"abbreviation", type:"text", required:true, unique:true},
    {name:"location_type", type: "select",required:true,options:["robotgame","judging","cultural","general","pit","volunteer"]},
    {name:"room", type:"text"},
    {name:"floor", type:"text"},
    {name:"checkin", type:"join", collection: "checkin", on: "location"}

  ]
}