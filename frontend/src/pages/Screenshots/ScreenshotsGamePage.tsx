import { Link, useParams } from 'react-router-dom'
import { GetScreenshotsForGame, NativeOpen } from '$app'
import { useApi } from '@/common/api'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Button } from '@/components/ui/button'
import { FaAngleLeft } from 'react-icons/fa6'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { useCallback, useMemo, useState } from 'react'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { screenshots } from '$models'
import { Dialog } from '@/components/ui/dialog'

function useScreenshotsDir(gameId: string) {
  const { data: screenshots, ...rest } = useApi(
    () => GetScreenshotsForGame(gameId),
    ['screenshots', 'game', gameId],
    {
      debug: true,
      initialData: {} as never,
    },
  )
  return {
    screenshots: screenshots ?? {},
    ...rest,
  }
}

function ScreenshotsGamePage() {
  const { gameId } = useParams()
  const { screenshots, isFetching } = useScreenshotsDir(gameId!)
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
  return (
    <div className="relative">
      <div className="sticky top-0 p-4 bg-background flex flex-col gap-2 z-10">
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/screenshots">
              <FaAngleLeft />
              Back
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 justify-between">
          <h1 className="text-2xl p-4 bg-background">
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
            <div className="flex items-start gap-4 flex-wrap max-w-full">
              {dir.screenshots.map((file, i) => (
                <ScreenshotImg
                  className="max-w-64 rounded-md"
                  screenshot={file}
                  key={file.path}
                  onClick={openScreenshotsModal(i)}
                />
              ))}
            </div>
          </LoadingContainer>
          <ScreenshotsCarouselModal screenshots={modalScreenshots} activeIndex={modalIndex} />
        </Dialog>
      </div>
    </div>
  )
}
export default ScreenshotsGamePage
