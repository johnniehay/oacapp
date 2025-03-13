import type { Block, Field } from 'payload'

import { CallToAction } from "@/payload/blocks/CallToAction/config";
import { MediaBlock } from "@/payload/blocks/MediaBlock/config";
import { Archive } from "@/payload/blocks/ArchiveBlock/config";
import { FormBlock } from "@/payload/blocks/Form/config";
import { Content } from "@/payload/blocks/Content/config";

const sectionFields: Field[] = [
  {
    name: 'heading',
    type: 'text',
    required: true,
    label: 'Section heading'
  },
  {
    name: 'contentblocks',
    type: 'blocks',
    blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
    label: 'Content'
  },
]

export const AccordionBlockConfig: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock',
  fields: [
    {
      name: 'multiple',
      type: 'checkbox',
      label: 'Allow multiple sections to be open simultaneously'
    },
    {
      name: 'sections',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: sectionFields,
    },
  ],
}
