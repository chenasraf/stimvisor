import { Link, useParams } from 'react-router-dom'
import { NativeOpen } from '$app'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Button } from '@/components/ui/button'
import { FaAngleLeft } from 'react-icons/fa6'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { Dialog } from '@/components/ui/dialog'
import { useGameScreenshots } from '@/common/hooks/useScreenshots'
import { FixedSizeGrid } from 'react-window'
import { useStateRef } from '@/common/hooks/useStateRef'

function ScreenshotsGamePage() {
  const thumbSize = 256 + 8
  const { gameId } = useParams()
  const { screenshots, isFetching } = useGameScreenshots(gameId!)
  const [dir] = screenshots.screenshotCollections ?? [{ screenshots: [] }]
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const modalScreenshots = useMemo(() => dir.screenshots ?? [], [dir])
  const openScreenshotsModal = useCallback(
    (index: number) => () => {
      setModalIndex(index)
    },
    [],
  )
  const closeScreenshotsModal = useCallback(() => {
    setModalIndex(null)
  }, [])

  const [headerRef, setHeaderRef] = useStateRef<HTMLDivElement | null>(null)
  const [gridRef, setGridRef] = useStateRef<HTMLDivElement | null>(null)
  const getColCount = useCallback(
    () => Math.floor((gridRef?.clientWidth ?? window.innerWidth) / thumbSize),
    [gridRef?.clientWidth, thumbSize],
  )
  const [colCount, setColCount] = useState(getColCount())

  useEffect(() => {
    const cb = () => {
      const w = gridRef?.clientWidth ?? window.innerWidth
      const newColCount = Math.floor(w / thumbSize)
      console.debug('colCount', newColCount, getColCount())
      if (newColCount !== colCount) {
        setColCount(newColCount)
      }
    }
    cb()
    window.addEventListener('resize', cb)
    return () => {
      window.removeEventListener('resize', cb)
    }
  }, [colCount, getColCount, gridRef, setGridRef, thumbSize])

  function Cell({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number
    rowIndex: number
    style: React.CSSProperties
  }) {
    const i = rowIndex * colCount + columnIndex
    const file = dir.screenshots[i]
    if (!file) return null
    return (
      <div style={{ width: thumbSize, ...style }} className="p-1">
        <ScreenshotImg
          className="rounded-md"
          screenshot={file}
          key={file.path}
          onClick={openScreenshotsModal(i)}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="sticky top-0 p-4 bg-background flex flex-col gap-2 z-10" ref={setHeaderRef}>
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/screenshots">
              <FaAngleLeft />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-2xl py-4 bg-background">
            Screenshots for <span className="text-black dark:text-white">{dir.gameName}</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => NativeOpen(dir.dir)}>
              Browse Folder
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Dialog
          modal
          open={modalIndex !== null}
          onOpenChange={(open) => !open && closeScreenshotsModal()}
        >
          <LoadingContainer loading={isFetching}>
            <div ref={setGridRef}>
              <FixedSizeGrid
                columnCount={colCount}
                columnWidth={thumbSize}
                height={window.innerHeight - (headerRef?.clientHeight ?? 200)}
                rowCount={Math.ceil((dir.screenshots?.length ?? 0) / colCount)}
                rowHeight={168}
                width={colCount * (thumbSize + 4)}
              >
                {Cell}
              </FixedSizeGrid>
            </div>
          </LoadingContainer>
          <ScreenshotsCarouselModal screenshots={modalScreenshots} activeIndex={modalIndex} />
        </Dialog>
      </div>
    </div>
  )
}

export default ScreenshotsGamePage
