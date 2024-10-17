import { HtmlProps } from '../../common/types'
import { cn } from '../../common/utils'

export function Loader({ className, ...rest }: HtmlProps<'div'>) {
  return (
    <div className={cn('', className)} {...rest}>
      Loading...
    </div>
  )
}
