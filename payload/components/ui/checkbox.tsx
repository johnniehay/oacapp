'use client'

import { cn } from '@/payload/utilities/ui'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { IconCheck } from '@tabler/icons-react'
// import Check from 'lucide-react'
import * as React from 'react'
// import {Checkbox, CheckboxProps} from "@mantine/core";

const Checkbox: React.FC<
  {
    ref?: React.Ref<HTMLButtonElement>
  } & React.ComponentProps<typeof CheckboxPrimitive.Root>
> = ({ className, ref, ...props }) => (
  <CheckboxPrimitive.Root
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <IconCheck className="h-4 w-4"/>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)
// function newCheckbox({ className, onCheckedChange, ...props }:
//                          // {ref?: React.Ref<HTMLButtonElement> } &
//                          {onCheckedChange?: (checked: boolean | 'indeterminate') => void} &
//                          CheckboxProps) {
//
//     return (<Checkbox  className={cn(
//         'peer h-4 w-4 shrink-0 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
//         className,
//     )} onChange={({target}) =>
//         onCheckedChange?.(target.indeterminate ? 'indeterminate' : target.checked)} {...props}/>)
// }

// export { newCheckbox as Checkbox }
export { Checkbox }
