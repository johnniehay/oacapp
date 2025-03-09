import type { MDXComponents } from 'mdx/types'
import {Title} from "@mantine/core";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (<Title order={1}>{children}</Title>),
    h2: ({ children }) => (<Title order={2}>{children}</Title>),
    h3: ({ children }) => (<Title order={3}>{children}</Title>),
    h4: ({ children }) => (<Title order={4}>{children}</Title>),
    h5: ({ children }) => (<Title order={5}>{children}</Title>),

    ...components,
  }
}