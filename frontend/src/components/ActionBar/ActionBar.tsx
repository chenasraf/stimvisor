import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const actionBarVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm flex items-center gap-3',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        primary: 'border-primary/50 text-primary dark:border-primary [&>svg]:text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const ActionBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof actionBarVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="actions"
    className={cn(actionBarVariants({ variant }), className)}
    {...props}
  />
))
ActionBar.displayName = 'ActionBar'

const ActionBarContent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('font-medium leading-none tracking-tight flex-1', className)}
    {...props}
  />
))
ActionBarContent.displayName = 'ActionBarContent'

const ActionBarActions = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 [&_p]:leading-relaxed flex-shrink-0', className)}
    {...props}
  />
))
ActionBarActions.displayName = 'ActionBarActions'

export { ActionBar, ActionBarContent, ActionBarActions }
