import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import { withPayload } from '@payloadcms/next/withPayload'


const nextConfig: NextConfig = {
  /* config options here */
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oac.firstsa.org',
                port: '',
                pathname: '/wp-content/uploads/2024/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'dev.oac.cids.org.za',
                port: '',
                pathname: '/api/media/file/**',
                search: undefined,
            }

        ]
    },
    output: "standalone",
    logging: {fetches:{fullUrl:true,hmrRefreshes:true},incomingRequests:true},
};

const withMDX = createMDX({})

export default withPayload(withMDX(nextConfig));
