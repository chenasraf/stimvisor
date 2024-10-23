import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { NativeOpen } from '$app'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'

export function GameScreenshotsListItem({
  className,
  collection: coll,
  onScreenshotClick,
  title,
  ...rest
}: HtmlProps<'div'> & {
  collection: screenshots.ScreenshotCollection
  title?: React.ReactNode
  onScreenshotClick?(
    event: React.MouseEvent<HTMLElement>,
    screenshot: screenshots.ScreenshotEntry,
    index: number,
    screenshots: screenshots.ScreenshotEntry[],
  ): void
}) {
  return (
    <div className={cn('', className)} {...rest}>
      <div key={coll.dir} className="flex flex-col gap-4 p-4">
        <div className="sticky top-[32px] bg-background flex items-center gap-2 justify-between z-0">
          <h2 className="text-xl">{title ?? coll.gameName}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/screenshots/${coll.gameId}`}>View All ({coll.totalCount})</Link>
            </Button>
            <Button variant="outline" onClick={() => NativeOpen(coll.dir)}>
              Browse Folder
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-4 flex-nowrap overflow-x-hidden max-w-full">
          {(coll.screenshots ?? []).map((entry, i) => (
            <ScreenshotImg
              className="max-w-64 rounded-md"
              screenshot={entry}
              key={entry.path}
              onClick={(e) => onScreenshotClick?.(e, entry, i, coll.screenshots)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
