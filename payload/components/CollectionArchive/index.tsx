import { cn } from '@/payload/utilities/ui'
import React from 'react'

import { Card, CardUpdateData } from '@/payload/components/Card'

export type Props = {
  updates: CardUpdateData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { updates } = props

  return (
    <div className={cn('container')}>
      <div>
        <div
          className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {updates?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo="updates" showCategories/>
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
