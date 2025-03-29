import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { authjsPlugin } from "@/lib/payload-authjs-custom";
import { authConfig } from "@/auth.config";
import { Categories } from '@/payload/collections/Categories'
import { Media } from '@/payload/collections/Media'
import { Pages } from '@/payload/collections/Pages'
import { Updates } from '@/payload/collections/Updates'
import { Users } from '@/payload/collections/Users'
import { Footer } from '@/payload/Footer/config'
import { Header } from '@/payload/Header/config'
import { plugins } from '@/payload/plugins'
import sharp from "sharp";
import { defaultLexical } from "@/payload/fields/defaultLexical";
import { NotificationSubscriptions } from "@/payload/collections/NotificationSubscriptions";
import { Teams } from "@/payload/collections/Teams";
import { Events } from "@/payload/collections/Events";
import { People } from "@/payload/collections/People";
import { AdminRoleOverride } from "@/payload/collections/AdminRoleOverride";
import { updateRoleOverridesCache } from "@/lib/get-role";
// import {SignInWithAuthjsButton} from "@/components/SignInWithAuthjsButton";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: defaultLexical, // lexicalEditor(),

  plugins: [
    authjsPlugin({
      authjsConfig: authConfig,
    }),
    ...plugins
  ],
  onInit: updateRoleOverridesCache,
  // Define and configure your collections in this array
  collections: [
    // {
    //   slug: "users",
    //   fields: [{
    //     name: "role",
    //     type: "text",
    //     label: "Role"
    //   }]
    // }
  Users, Pages, Updates, Media, Categories,NotificationSubscriptions,Teams,Events,People, AdminRoleOverride],

  globals: [Header, Footer],

  sharp,

  admin: {
    user: "users",
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || '',
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: mongooseAdapter({
    url: process.env.MONGODB_DATABASE_URI || '',
  }),
})