import type { CollectionConfig } from "payload";
import { anyone } from "@/payload/access/anyone";
import { authenticated } from "@/payload/access/authenticated";

export const Teams: CollectionConfig<"team"> = {
  slug: "team",

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {useAsTitle:"number"},
  fields:[
    { name:"number", type:"text", required:true,unique:true, },
    { name:"name", type:"text", required:true, unique:true },
    { name:"country", type:"text"},

    { name:"events", type:"join", collection:"event", on:"teams", defaultLimit:0}
    // endpoint       String   @unique
    // { name:"endpoint", type:"text", required:true },
    // // expirationTime Int?
    // { name:"expirationTime", type:"date" },
    // // keys_p256dh    String
    // // keys_auth      String
    // { name:"keys", type:"json", jsonSchema: {
    //     schema: {
    //       type: "object",
    //       properties: { p256dh: { type: "string" }, auth: { type: "string" } },
    //       required: ["p256dh", "auth"]
    //     },
    //     fileMatch: ['notification://keys'],
    //     uri: 'notification://keys'
    //   }, required:true },
    // // topic          String
    // { name:"topics", type:"select", interfaceName:"NotificationTopic", hasMany:true, options:[{label:"Test Notifications", value:"test"}] },
    // // userId         String?
    // { name: "user", type:"relationship",relationTo:"users",hasMany:false}

  ]
}