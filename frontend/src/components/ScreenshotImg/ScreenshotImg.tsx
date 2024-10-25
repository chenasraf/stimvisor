import { HtmlProps } from '@/common/types'
import { screenshots } from '$models'
import { cn } from '@/common/utils'
import { Checkbox } from '@ui/checkbox'

export function ScreenshotImg({
  className,
  screenshot,
  selectable = false,
  selected = false,
  onToggleSelect,
  ...rest
}: Omit<HtmlProps<'img'>, 'src'> & {
  screenshot: screenshots.ScreenshotEntry
  load?: boolean
  selectable?: boolean
  selected?: boolean
  onToggleSelect?(value: boolean): void
}) {
  const img = <img src={screenshot.url} alt={screenshot.name} {...rest} />

  if (selectable) {
    return (
      <div className={cn('rounded-md relative', rest.onClick && 'cursor-pointer', className)}>
        {img}
        <Checkbox
          checked={selected}
          onCheckedChange={() => {
            console.log('toggle select', selected)
            onToggleSelect?.(!selected)
          }}
          className="absolute top-1 right-1"
        />
      </div>
    )
  }

  return <div className={cn('rounded-md', rest.onClick && 'cursor-pointer', className)}>{img}</div>
}
