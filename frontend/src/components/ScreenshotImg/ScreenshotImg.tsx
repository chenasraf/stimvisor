import { HtmlProps } from '@/common/types'
import { screenshots } from '$models'
import { cn } from '@/common/utils'

export function ScreenshotImg({
  className,
  screenshot,
  ...rest
}: HtmlProps<'div'> & { screenshot: screenshots.ScreenshotEntry }) {
  return (
    <div className={cn('', rest.onClick && 'cursor-pointer', className)} {...rest}>
      <img className="rounded-md" src={screenshot.base64} alt={screenshot.name} />
    </div>
  )
}
