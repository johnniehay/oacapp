import type { Update, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/payload/components/RichText'

import { CollectionArchive } from '@/payload/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
  id?: string
}
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let updates: Update[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedUpdates = await payload.find({
      collection: 'updates',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
          where: {
            categories: {
              in: flattenedCategories,
            },
          },
        }
        : {}),
    })

    updates = fetchedUpdates.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedUpdates = selectedDocs.map((update) => {
        if (typeof update.value === 'object') return update.value
      }) as Update[]

      updates = filteredSelectedUpdates
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false}/>
        </div>
      )}
      <CollectionArchive updates={updates}/>
    </div>
  )
}
