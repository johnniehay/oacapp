import React from 'react'

import type { AccordionBlock as AccordionBlockProps } from '@/payload-types'

import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from "@mantine/core";
import { RenderBlocks } from "@/payload/blocks/RenderBlocks";

export async function AccordionBlock(props: AccordionBlockProps) {
  const { sections, multiple } = props
  if (!sections) { return <></> }

  const renderAccordionItem = (section: typeof sections[number]) => {
    const { heading, contentblocks, } = section
    return (
      <AccordionItem key={heading} value={heading}>
        <AccordionControl>{heading}</AccordionControl>
        <AccordionPanel>
          {contentblocks && <RenderBlocks blocks={contentblocks}/>}
        </AccordionPanel>
      </AccordionItem>)
  }
  return (
    <div className="container my-4">
      <Accordion multiple={!!multiple}>
        {sections?.map((section) => renderAccordionItem(section))}
      </Accordion>
    </div>
  )
}
