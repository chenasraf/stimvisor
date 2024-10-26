import { HtmlProps } from '@/common/types'
import { screenshots } from '$models'
import { cn } from '@/common/utils'
import { Checkbox } from '@ui/checkbox'
import { FullscreenIcon } from '@icons'
import { Button } from '@ui/button'

export function ScreenshotImg({
  className,
  imgClassName,
  screenshot,
  selectable = false,
  selected = false,
  selectMode,
  onToggleSelect,
  onOpenPreview,
  ...rest
}: Omit<HtmlProps<'img'>, 'src'> & {
  imgClassName?: string
  screenshot: screenshots.ScreenshotEntry
  load?: boolean
  selectable?: boolean
  selectMode?: boolean
  selected?: boolean
  onToggleSelect?(value: boolean): void
  onOpenPreview?(): void
}) {
  const img = <img className={imgClassName} src={screenshot.url} alt={screenshot.name} {...rest} />

  if (selectable) {
    return (
      <div className={cn('group rounded-md relative', rest.onClick && 'cursor-pointer', className)}>
        {img}
        <Checkbox
          className={cn(
            'absolute top-1 right-1 text-lg',
            !selectMode && 'hidden group-hover:block',
          )}
          checked={selected}
          onCheckedChange={() => {
            console.log('toggle select', selected)
            onToggleSelect?.(!selected)
          }}
        />
        {selectMode && (
          <Button
            className="absolute bottom-1 right-1"
            variant="secondary"
            size="icon"
            onClick={onOpenPreview}
          >
            <FullscreenIcon />
          </Button>
        )}
      </div>
    )
  }

  return <div className={cn('rounded-md', rest.onClick && 'cursor-pointer', className)}>{img}</div>
}
