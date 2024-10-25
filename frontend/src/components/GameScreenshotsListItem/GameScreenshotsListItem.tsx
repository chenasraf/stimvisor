import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { NativeOpen } from '$app'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { useMemo } from 'react'
import { OpenFolderIcon } from '../Icons/Icons'

export function GameScreenshotsListItem({
  className,
  collection: coll,
  onScreenshotClick,
  title,
  limit = 0,
  ...rest
}: HtmlProps<'div'> & {
  collection: screenshots.ScreenshotCollection
  title?: React.ReactNode
  limit?: number
  onScreenshotClick?(
    event: React.MouseEvent<HTMLElement>,
    screenshot: screenshots.ScreenshotEntry,
    index: number,
    screenshots: screenshots.ScreenshotEntry[],
  ): void
}) {
  const scrs = useMemo(() => {
    let lst = coll.screenshots ?? []
    if (limit) {
      lst = lst.slice(0, limit)
    }
    return lst
  }, [coll.screenshots, limit])

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
              <OpenFolderIcon />
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-4 flex-nowrap overflow-x-hidden max-w-full">
          {scrs.map((entry, i) => (
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
