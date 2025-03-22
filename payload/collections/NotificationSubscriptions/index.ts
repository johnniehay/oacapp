import type { CollectionConfig } from 'payload'
import { checkPermission } from "@/payload/access/checkPermission";

export const NotificationSubscriptions: CollectionConfig<"notificationSubscription"> = {
  slug: "notificationSubscription",

  access: {
    create: checkPermission("admin"),
    delete: checkPermission("admin"),
    read: checkPermission("admin"),
    update: checkPermission("admin"),
  },
  fields:[
    // endpoint       String   @unique
    { name:"endpoint", type:"text", required:true },
    // expirationTime Int?
    { name:"expirationTime", type:"date" },
    // keys_p256dh    String
    // keys_auth      String
    { name:"keys", type:"json", jsonSchema: {
        schema: {
          type: "object",
          properties: { p256dh: { type: "string" }, auth: { type: "string" } },
          required: ["p256dh", "auth"]
        },
        fileMatch: ['notification://keys'],
        uri: 'notification://keys'
      }, required:true },
    // topic          String
    { name:"topics", type:"select", interfaceName:"NotificationTopic", hasMany:true, options:[{label:"Test Notifications", value:"test"}] },
    // userId         String?
    { name: "user", type:"relationship",relationTo:"users",hasMany:false}

  ]
}