import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Update } from '../../../payload-types'

export const revalidateUpdate: CollectionAfterChangeHook<Update> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/updates/${doc.slug}`

      payload.logger.info(`Revalidating update at path: ${path}`)

      revalidatePath(path)
      revalidateTag('updates-sitemap')
    }

    // If the update was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/updates/${previousDoc.slug}`

      payload.logger.info(`Revalidating old update at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('updates-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Update> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/updates/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('updates-sitemap')
  }

  return doc
}
