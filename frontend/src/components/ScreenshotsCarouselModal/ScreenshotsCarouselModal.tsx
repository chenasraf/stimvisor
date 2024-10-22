import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
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
      <DialogContent className="max-w-[calc(100%_-_128px)] max-h-[calc(100%_-_64px)]">
        <DialogTitle>Screenshots</DialogTitle>
        <Carousel opts={{ startIndex: activeIndex ?? undefined }}>
          <CarouselContent className="max-w-full max-h-full">
            {screenshots.map((scr) => (
              <CarouselItem key={scr.path} className="flex items-center justify-center">
                <ScreenshotImg
                  screenshot={scr}
                  className="max-h-[calc(100vh_-_128px)] object-cover mx-auto"
                />
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
