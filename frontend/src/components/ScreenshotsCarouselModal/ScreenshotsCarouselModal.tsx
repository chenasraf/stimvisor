import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { DialogContent } from '../ui/dialog'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { ScreenshotImg } from '../ScreenshotImg/ScreenshotImg'

export function ScreenshotsCarouselModal({
  className,
  screenshots,
  activeIndex,
  ...rest
}: HtmlProps<'div'> & {
  screenshots: screenshots.ScreenshotEntry[]
  activeIndex?: number | null
}) {
  return (
    <div className={cn('', className)} {...rest}>
      <DialogContent className="max-w-[calc(100%_-_128px)]">
        <Carousel opts={{ startIndex: activeIndex ?? undefined }}>
          <CarouselContent>
            {screenshots.map((scr) => (
              <CarouselItem key={scr.path}>
                <div className="h-full flex items-center">
                  <ScreenshotImg screenshot={scr} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </div>
  )
}
