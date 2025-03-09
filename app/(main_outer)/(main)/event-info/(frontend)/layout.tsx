import type { Metadata } from 'next'

// import { cn } from'@/payload/utilities/ui'
// import { GeistMono } from 'geist/font/mono'
// import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/payload/components/AdminBar'
import { Footer } from '@/payload/Footer/Component'
import { Header } from '@/payload/Header/Component'
import { Providers } from '@/payload/providers'
// import { InitTheme } from '@/payload/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/payload/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/payload/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    // <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
    //   <head>
    //     <InitTheme />
    //     <link href="/favicon.ico" rel="icon" sizes="32x32" />
    //     <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
    //   </head>
    //   <body>
    <Providers>
      <AdminBar
        adminBarProps={{
          preview: isEnabled,
        }}
      />

      <Header/>
      {children}
      <Footer/>
    </Providers>
    //   </body>
    // </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
