import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { Loader } from './Loader'

export function LoadingContainer({
  className,
  loading,
  children,
  ...rest
}: HtmlProps<'div'> & { loading: boolean }) {
  return loading ? (
    <Loader
      className={cn('w-full h-full flex items-center justify-center min-h-[50vh]', className)}
      {...rest}
    />
  ) : (
    children
  )
}
