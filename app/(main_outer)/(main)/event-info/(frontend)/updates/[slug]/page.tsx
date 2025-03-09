import type { Metadata } from 'next'

import { RelatedUpdates } from'@/payload/blocks/RelatedUpdates/Component'
import { PayloadRedirects } from'@/payload/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from'@/payload/components/RichText'

import type { Update } from '@/payload-types'

import { UpdateHero } from'@/payload/heros/UpdateHero'
import { generateMeta } from'@/payload/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from'@/payload/components/LivePreviewListener'
import {promise} from "zod";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const updates = await payload.find({
    collection: 'updates',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = updates.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}


export default async function Update({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/updates/' + slug
  const update = await queryUpdateBySlug({ slug })

  if (!update) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <UpdateHero update={update} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={update.content} enableGutter={false} />
          {update.relatedUpdates && update.relatedUpdates.length > 0 && (
            <RelatedUpdates
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={update.relatedUpdates.filter((update) => typeof update === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const update = await queryUpdateBySlug({ slug })

  return generateMeta({ doc: update })
}

const queryUpdateBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'updates',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
