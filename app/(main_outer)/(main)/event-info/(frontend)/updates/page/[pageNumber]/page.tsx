import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/payload/components/CollectionArchive'
import { PageRange } from '@/payload/components/PageRange'
import { Pagination } from '@/payload/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const updates = await payload.find({
    collection: 'updates',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient/>
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

      <CollectionArchive updates={updates.docs}/>

      <div className="container">
        {updates?.page && updates?.totalPages > 1 && (
          <Pagination page={updates.page} totalPages={updates.totalPages}/>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `OAC Updates Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'updates',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
