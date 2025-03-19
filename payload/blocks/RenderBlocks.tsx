import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/payload/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/payload/blocks/CallToAction/Component'
import { ContentBlock } from '@/payload/blocks/Content/Component'
import { FormBlock } from '@/payload/blocks/Form/Component'
import { MediaBlock } from '@/payload/blocks/MediaBlock/Component'
import { AccordionBlock } from "@/payload/blocks/Accordion/Component";
import { HotelsBlock } from "@/payload/blocks/HotelsBlock/Component";

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  accordion: AccordionBlock,
  hotelsBlock: HotelsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-4" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer/>
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
