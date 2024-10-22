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
  useCarousel,
} from '../ui/carousel'
import { ScreenshotImg } from '../ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useState } from 'react'

export function ScreenshotsCarouselModal(
  props: HtmlProps<'div'> & {
    screenshots: screenshots.ScreenshotEntry[]
    activeIndex?: number | null
  },
) {
  const { className, activeIndex, ...rest } = props
  return (
    <div className={cn('', className)} {...rest}>
      <DialogContent className="max-w-[calc(100%_-_128px)] max-h-[calc(100%_-_64px)]">
        <DialogTitle>Screenshots</DialogTitle>
        <Carousel opts={{ startIndex: activeIndex ?? undefined, loop: true }}>
          <CarouselInner {...props} />
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </div>
  )
}

function CarouselInner({
  activeIndex,
  screenshots,
}: React.ComponentProps<typeof ScreenshotsCarouselModal>) {
  const carousel = useCarousel()
  const [inView, setInView] = useState(() => carousel.api?.slidesInView() ?? [])
  const isInView = useCallback(
    (idx: number) =>
      [-2, -1, 0, 1, 2].map((x) => idx + x).some((x) => activeIndex === x || inView.includes(x)),
    [activeIndex, inView],
  )

  useEffect(() => {
    if (!carousel.api) {
      return
    }
    const { api } = carousel
    const cb = () => {
      setInView(api.slidesInView() ?? [])
    }
    api.on('slidesInView', cb)
    return () => {
      api.off('slidesInView', cb)
    }
  }, [carousel])

  return (
    <CarouselContent className="max-h-full">
      {screenshots.map((scr, i) => (
        <CarouselItem key={scr.path} className="flex items-center justify-center">
          <ScreenshotImg
            screenshot={scr}
            load={isInView(i)}
            className="max-h-[calc(100vh_-_160px)] object-cover mx-auto"
          />
        </CarouselItem>
      ))}
    </CarouselContent>
  )
}
