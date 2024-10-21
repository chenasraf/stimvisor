import { HtmlProps } from '@/common/types'
import { screenshots } from '$models'
import { cn } from '@/common/utils'

export function ScreenshotImg({
  className,
  screenshot,
  ...rest
}: Omit<HtmlProps<'img'>, 'src'> & { screenshot: screenshots.ScreenshotEntry }) {
  return (
    <img className={cn('rounded-md', rest.onClick && 'cursor-pointer', className)} src={screenshot.base64} alt={screenshot.name} {...rest} />
  )
}
