import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  type LinkFields, defaultEditorFeatures, BlocksFeature, EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from "@/payload/blocks/MediaBlock/config";
import { HotelsBlock } from "@/payload/blocks/HotelsBlock/config";

export const defaultLexical = lexicalEditor({
  features: [...defaultEditorFeatures,
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({blocks:[MediaBlock,HotelsBlock]})
    // ParagraphFeature(),
    // UnderlineFeature(),
    // BoldFeature(),
    // ItalicFeature(),
    // LinkFeature({
    //   enabledCollections: ['pages', 'updates'],
    //   fields: ({ defaultFields }) => {
    //     const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
    //       if ('name' in field && field.name === 'url') return false
    //       return true
    //     })
    //
    //     return [
    //       ...defaultFieldsWithoutUrl,
    //       {
    //         name: 'url',
    //         type: 'text',
    //         admin: {
    //           condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
    //         },
    //         label: ({ t }) => t('fields:enterURL'),
    //         required: true,
    //         validate: ((value, options) => {
    //           if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
    //             return true // no validation needed, as no url should exist for internal links
    //           }
    //           return value ? true : 'URL is required'
    //         }) as TextFieldSingleValidation,
    //       },
    //     ]
    //   },
    // }),
  ],
})
