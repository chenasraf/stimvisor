import { HtmlProps } from '@/common/types'
import React from 'react'
import { cn } from '@/common/utils'

export function {{pascalCase name}}({ className, ...rest }: HtmlProps<'div'>) {
  return (
    <div className={cn('', className)} {...rest}>
      {{pascalCase name}}
    </div>
  )
}
