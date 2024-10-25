import { HtmlProps } from '@/common/types'
import { cn } from '@/common/utils'
import { screenshots } from '$models'
import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ScreenshotImg } from '../ScreenshotImg/ScreenshotImg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ButtonProps } from '../ui/button'
import { ManageScreenshot, NativeOpen } from '$app'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  ExternalLinkIcon,
  OpenFolderIcon,
} from '../Icons/Icons'

export function ScreenshotsCarouselModal(
  props: HtmlProps<'div'> & {
    screenshots: screenshots.ScreenshotEntry[]
    activeIndex?: number | null
    onDeleteScreenshot(idx: number, path: string): void
  },
) {
  const { className, screenshots, activeIndex, onDeleteScreenshot, ...rest } = props
  const [idx, setIdx] = useState(activeIndex ?? 0)
  useEffect(() => {
    setIdx(activeIndex ?? 0)
  }, [activeIndex])
  const [confirmDelete, setConfirmDelete] = useState(false)
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

  const handleDelete = useCallback(() => {
    ManageScreenshot(screenshots[idx].path, 'delete')
    onDeleteScreenshot?.(idx, screenshots[idx].path)
  }, [idx, onDeleteScreenshot, screenshots])

  const actions = [
    {
      label: 'Open Containing Folder',
      icon: <OpenFolderIcon />,
      onClick: () => NativeOpen(screenshots[idx].dir),
    },
    {
      label: 'Open in Default App',
      icon: <ExternalLinkIcon />,
      onClick: () => NativeOpen(screenshots[idx].path),
    },
    {
      label: 'Delete',
      icon: <DeleteIcon />,
      onClick: () => setConfirmDelete(true),
      variant: 'destructive',
    },
  ]

  return (
    <div className={cn('', className)} {...rest} onKeyUp={handleKeyUp}>
      <DialogContent className="max-w-[calc(100%_-_128px)] max-h-[calc(100%_-_64px)]">
        <DialogTitle>Screenshots</DialogTitle>
        <div className="flex gap-4 items-center w-full">
          <Button
            className="flex-shrink-0"
            variant="outline"
            size="icon"
            onClick={prevScreenshot}
            aria-keyshortcuts="ArrowLeft"
          >
            <ChevronLeftIcon />
          </Button>
          <div className="flex-grow flex place-content-center">
            {visible.map((scr, i) => (
              <ScreenshotImg
                key={scr.path}
                screenshot={scr}
                className={cn('max-h-[calc(100vh_-_220px)] object-cover', i !== 1 && 'hidden')}
              />
            ))}
          </div>
          <Button
            className="flex-shrink-0"
            variant="outline"
            size="icon"
            onClick={nextScreenshot}
            aria-keyshortcuts="ArrowRight"
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="flex place-content-center gap-2">
          <TooltipProvider>
            {actions.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant={(action.variant as ButtonProps['variant']) ?? 'secondary'}
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </Button>
                  <TooltipContent>{action.label}</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </DialogContent>
      <AlertDialog open={confirmDelete} onOpenChange={(s) => !s && setConfirmDelete(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this screenshot?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. You will delete the file entirely from the file system,
              not move it into the Trash.
              <br />
              <br />
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              <DeleteIcon />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
