// import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
// import { importExportPlugin } from "@payloadcms/plugin-import-export";
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/payload/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/payload/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/payload/search/beforeSync'

import { Page, Update } from '@/payload-types'
import { getServerSideURL } from '@/payload/utilities/getURL'
import { checkPermission } from "@/payload/access/checkPermission";
import { anyone } from "@/payload/access/anyone";
// import path from "path";
// import { fileURLToPath } from "url";

const generateTitle: GenerateTitle<Update | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | OAC App` : 'OAC App'
}

const generateURL: GenerateURL<Update | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

// const filename = fileURLToPath(import.meta.url)
// const dirname = path.dirname(filename)

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'updates'],
    overrides: {
      access:{
        read: checkPermission("admin"),
        create: checkPermission("admin"),
        delete: checkPermission("admin"),
        update: checkPermission("admin")
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      access:{
        read: checkPermission("all:forms"),
        create: checkPermission("all:forms"),
        delete: checkPermission("all:forms"),
        update: checkPermission("all:forms")
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides:{
      access:{
        create: anyone,
        read: checkPermission("all:forms"),
        delete: checkPermission("all:forms"),
        update: checkPermission("all:forms")
      },
    }
  }),
  searchPlugin({
    collections: ['updates'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      access:{
        create: checkPermission("create:update"),
        read: checkPermission("update:update"),
        delete: checkPermission("remove:update"),
        update: checkPermission("update:update")
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // importExportPlugin({}),
  // importExportPlugin({
  //   overrideExportCollection: (collection) => {
  //     collection.admin.group = 'System'
  //     collection.upload.staticDir = path.resolve(dirname, '../../.next/uploads')
  //     return collection
  //   },
  //   disableJobsQueue: true,
  // }),
  // importExportPlugin({
  //   collections: ['pages'],
  //   overrideExportCollection: (collection) => {
  //     collection.slug = 'exports-tasks'
  //     if (collection.admin) {
  //       collection.admin.group = 'System'
  //     }
  //     collection.upload.staticDir = path.resolve(dirname, '../../.next/uploads')
  //     return collection
  //   },
  // }),
  // payloadCloudPlugin(),
]
