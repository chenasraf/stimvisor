import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScreenshotImg } from '../ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

export function ScreenshotsCarouselModal(
  props: HtmlProps<'div'> & {
    screenshots: screenshots.ScreenshotEntry[]
    activeIndex?: number | null
  },
) {
  const { className, screenshots, activeIndex, ...rest } = props
  const [idx, setIdx] = useState(activeIndex ?? 0)
  useEffect(() => {
    setIdx(activeIndex ?? 0)
  }, [activeIndex])
  const visible = useMemo(() => {
    const thresh = 1
    const min = idx - thresh
    const max = idx + thresh
    let vis = screenshots.slice(Math.max(0, min), Math.min(idx + thresh + 1, screenshots.length))
    if (min < 0) {
      vis = screenshots.slice(min).concat(vis)
    }
    if (max >= screenshots.length) {
      vis = vis.concat(screenshots.slice(0, max - screenshots.length + 1))
    }

    return vis
  }, [idx, screenshots])

  const prevScreenshot = useCallback(
    () => setIdx((i) => (i === 0 ? screenshots.length - 1 : --i)),
    [screenshots.length],
  )
  const nextScreenshot = useCallback(
    () => setIdx((i) => (i === screenshots.length ? 0 : ++i)),
    [screenshots.length],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextScreenshot()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevScreenshot()
      }
    },
    [nextScreenshot, prevScreenshot],
  )

  return (
    <div className={cn('', className)} {...rest} onKeyUp={handleKeyUp}>
      <DialogContent className="max-w-[calc(100%_-_128px)] max-h-[calc(100%_-_64px)]">
        <DialogTitle>Screenshots</DialogTitle>
        <div className="flex gap-4 items-center w-full">
          <Button className="flex-shrink-0" variant="outline" size="icon" onClick={prevScreenshot}>
            <FaAngleLeft />
          </Button>
          <div className="flex-grow flex place-content-center">
            {visible.map((scr, i) => (
              <ScreenshotImg
                key={scr.path}
                screenshot={scr}
                className={cn('max-h-[calc(100vh_-_160px)] object-cover', i !== 1 && 'hidden')}
              />
            ))}
          </div>
          <Button className="flex-shrink-0" variant="outline" size="icon" onClick={nextScreenshot}>
            <FaAngleRight />
          </Button>
        </div>
      </DialogContent>
    </div>
  )
}
