import { Link, useParams } from 'react-router-dom'
import { ManageScreenshot, NativeOpen } from '$app'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Button } from '@ui/button'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { Dialog } from '@ui/dialog'
import { useGameScreenshots } from '@/common/hooks/useScreenshots'
import { FixedSizeGrid } from 'react-window'
import { useStateRef } from '@/common/hooks/useStateRef'
import { useScreenshotsModal } from '@/components/ScreenshotsCarouselModal/useScreenshotsModal'
import { screenshots } from '$models'
import { CheckDoubleIcon, ChevronLeftIcon, DeleteIcon, OpenFolderIcon } from '@icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/tooltip'
import { useRecoverableScrollPosition } from '@/common/hooks/useRecoverableScrollPosition'
import { ActionBar, ActionBarActions, ActionBarContent } from '@/components/ActionBar/ActionBar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog'

function ScreenshotsGamePage() {
  const thumbSize = 256 + 8
  const { gameId } = useParams()
  const { screenshots, isPending, refetch } = useGameScreenshots(gameId!)
  const [selected, setSelected] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const toggleSelectedValue = useCallback(
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
  useEffect(() => {
    setSelectionMode(selected.length > 0)
  }, [selected.length])
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
      setSelected([])
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
            selectMode={selectionMode}
            onToggleSelect={toggleSelectedValue(file)}
            screenshot={file}
            key={file.path}
            onClick={() => {
              return selectionMode
                ? toggleSelectedValue(file)()
                : openScreenshotsModal(i, dir.screenshots)
            }}
            onOpenPreview={() => openScreenshotsModal(i, dir.screenshots)}
          />
        </div>
      )
    },
    [
      colCount,
      dir.screenshots,
      openScreenshotsModal,
      selected,
      selectionMode,
      toggleSelectedValue,
      thumbSize,
    ],
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

  const [confirmDelete, setConfirmDelete] = useState<screenshots.ScreenshotEntry[] | null>(null)
  const handleDelete = useCallback(
    async (screenshots: screenshots.ScreenshotEntry[]) => {
      await ManageScreenshot(
        screenshots.map((s) => s.path),
        'delete',
      )
      setSelected([])
      refetch()
    },
    [refetch],
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
        {selectionMode && (
          <ActionBar variant="primary">
            <CheckDoubleIcon />
            <ActionBarContent>{selected.length} selected</ActionBarContent>
            <ActionBarActions>
              <Button
                variant="secondary"
                onClick={() => setSelected(dir.screenshots.map((x) => x.path))}
              >
                Select All
              </Button>
              <Button variant="secondary" onClick={() => setSelected([])}>
                Select None
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() =>
                  setConfirmDelete(dir.screenshots.filter((scr) => selected.includes(scr.path)))
                }
              >
                <DeleteIcon />
              </Button>
            </ActionBarActions>
          </ActionBar>
        )}
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
          <AlertDialog
            open={Boolean(confirmDelete)}
            onOpenChange={(s) => !s && setConfirmDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete{' '}
                  {selected.length === 1 ? 'this screenshot' : 'these screenshots'}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <b>
                    You are about to delete {selected.length}{' '}
                    {selected.length === 1 ? 'screenshot' : 'screenshots'}.
                  </b>
                  <br />
                  <br />
                  This action is irreversible. You will delete files entirely from the file system,
                  not move them into the Trash.
                  <br />
                  <br />
                  Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => handleDelete(confirmDelete!)}
                >
                  <DeleteIcon />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      </div>
    </div>
  )
}

export default ScreenshotsGamePage
