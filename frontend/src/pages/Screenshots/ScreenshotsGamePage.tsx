import { Link, useParams } from 'react-router-dom'
import { NativeOpen } from '$app'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Button } from '@/components/ui/button'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { Dialog } from '@/components/ui/dialog'
import { useGameScreenshots } from '@/common/hooks/useScreenshots'
import { FixedSizeGrid } from 'react-window'
import { useStateRef } from '@/common/hooks/useStateRef'
import { useScreenshotsModal } from '@/components/ScreenshotsCarouselModal/useScreenshotsModal'
import { screenshots } from '$models'
import { ChevronLeftIcon, OpenFolderIcon } from '@/components/Icons/Icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip'
import { useRecoverableScrollPosition } from '@/common/hooks/useRecoverableScrollPosition'

function ScreenshotsGamePage() {
  const thumbSize = 256 + 8
  const { gameId } = useParams()
  const { screenshots, isPending, refetch } = useGameScreenshots(gameId!)
  const [selected, setSelected] = useState<string[]>([])
  const setSelectedValue = useCallback(
    (file: screenshots.ScreenshotEntry) => () => {
      setSelected((selected) => {
        if (selected.includes(file.path)) {
          return selected.filter((s) => s !== file.path)
        }
        return [...selected, file.path]
      })
    },
    [],
  )
  const [dir] = screenshots.screenshotCollections ?? [{ screenshots: [] }]
  const {
    modalIndex,
    modalScreenshots,
    closeScreenshotsModal,
    openScreenshotsModal,
    deleteScreenshot,
  } = useScreenshotsModal()

  const handleDeleteScreenshot = useCallback(
    (idx: number) => {
      console.debug('deleteScreenshot', idx)
      deleteScreenshot(idx)
      refetch()
    },
    [deleteScreenshot, refetch],
  )

  const [headerRef, setHeaderRef] = useStateRef<HTMLDivElement | null>(null)
  const [gridRef, setGridRef] = useStateRef<HTMLDivElement | null>(null)
  const getColCount = useCallback(
    () => Math.floor((gridRef?.clientWidth ?? window.innerWidth) / thumbSize),
    [gridRef?.clientWidth, thumbSize],
  )
  const [colCount, setColCount] = useState(getColCount())

  const scrollParent = useMemo(
    () => gridRef?.firstElementChild?.firstElementChild as HTMLElement,
    [gridRef],
  )

  useRecoverableScrollPosition(scrollParent?.parentElement)

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

  const Cell = useCallback(
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
      const isSelected = Boolean(file) && selected.includes(file.path)
      if (!file) return null
      return (
        <div style={{ width: thumbSize, ...style }} className="p-1">
          <ScreenshotImg
            className="rounded-md"
            selectable
            selected={isSelected}
            onToggleSelect={setSelectedValue(file)}
            screenshot={file}
            key={file.path}
            onClick={() => openScreenshotsModal(i, dir.screenshots)}
          />
        </div>
      )
    },
    [colCount, dir.screenshots, openScreenshotsModal, selected, setSelectedValue, thumbSize],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollParent?.scrollBy(0, -thumbSize)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        scrollParent?.scrollBy(0, thumbSize)
      }
    },
    [scrollParent, thumbSize],
  )

  return (
    <div className="relative" onKeyUp={handleKeyUp}>
      <div className="sticky top-0 p-4 bg-background flex flex-col gap-2 z-10" ref={setHeaderRef}>
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/screenshots">
              <ChevronLeftIcon />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-2xl py-4 bg-background">
            Screenshots for <span className="text-black dark:text-white">{dir.gameName}</span>
          </h1>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline" onClick={() => NativeOpen(dir.dir)}>
                  <OpenFolderIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open containing folder</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Dialog
          modal
          open={modalIndex !== null}
          onOpenChange={(open) => !open && closeScreenshotsModal()}
        >
          <LoadingContainer loading={isPending}>
            <div ref={setGridRef} data-grid-container>
              <FixedSizeGrid
                columnCount={colCount}
                columnWidth={thumbSize}
                height={window.innerHeight - (headerRef?.clientHeight ?? 224) - 24}
                rowCount={Math.ceil((dir.screenshots?.length ?? 0) / colCount)}
                rowHeight={168}
                width={colCount * (thumbSize + 4)}
                data-grid
              >
                {Cell}
              </FixedSizeGrid>
            </div>
          </LoadingContainer>
          <ScreenshotsCarouselModal
            screenshots={modalScreenshots}
            activeIndex={modalIndex}
            onDeleteScreenshot={handleDeleteScreenshot}
          />
        </Dialog>
      </div>
    </div>
  )
}

export default ScreenshotsGamePage
