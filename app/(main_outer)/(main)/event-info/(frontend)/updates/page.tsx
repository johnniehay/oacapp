import type { Metadata } from 'next/types'

import { CollectionArchive } from'@/payload/components/CollectionArchive'
import { PageRange } from'@/payload/components/PageRange'
import { Pagination } from'@/payload/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const updates = await payload.find({
    collection: 'updates',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Updates</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="updates"
          currentPage={updates.page}
          limit={12}
          totalDocs={updates.totalDocs}
        />
      </div>

      <CollectionArchive updates={updates.docs} />

      <div className="container">
        {updates.totalPages > 1 && updates.page && (
          <Pagination page={updates.page} totalPages={updates.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Updates`,
  }
}
