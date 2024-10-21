import { Link, Route, Routes } from 'react-router-dom'
import { GetScreenshots, NativeOpen } from '$app'
import { useApi } from '@/common/api'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Button } from '@/components/ui/button'
import ScreenshotsGamePage from './ScreenshotsGamePage'
import { ScreenshotImg } from '@/components/ScreenshotImg/ScreenshotImg'
import { Dialog } from '@/components/ui/dialog'
import { useCallback, useState } from 'react'
import { screenshots } from '$models'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'

function useScreenshotsDirs() {
  const { data: screenshots, ...rest } = useApi(GetScreenshots, ['screenshots'], {
    debug: true,
    initialData: {} as never,
  })
  return {
    screenshots: screenshots ?? {},
    ...rest,
  }
}

export function ScreenshotsHomePage() {
  return (
    <Routes>
      <Route path="/:gameId" element={<ScreenshotsGamePage />} />
      <Route path="/" element={<ScreenshotsHome />} />
    </Routes>
  )
}

function ScreenshotsHome() {
  const { screenshots, isFetching } = useScreenshotsDirs()
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [modalScreenshots, setModalScreenshots] = useState<screenshots.ScreenshotEntry[]>([])
  const openScreenshotsModal = useCallback(
    (screenshots: screenshots.ScreenshotEntry[], index: number) => () => {
      setModalIndex(index)
      setModalScreenshots(screenshots)
    },
    [],
  )
  const closeScreenshotsModal = useCallback(() => {
    setModalIndex(null)
    setModalScreenshots([])
  }, [])

  return (
    <div className="relative">
      <h1 className="sticky top-0 p-4 bg-background text-2xl z-10">Screenshots</h1>

      <div>
        <Dialog
          modal
          open={modalIndex !== null}
          onOpenChange={(open) => !open && closeScreenshotsModal()}
        >
          <LoadingContainer loading={isFetching}>
            <div className="flex flex-col gap-2">
              {screenshots.screenshotCollections?.map((dir) => (
                <div key={dir.dir} className="flex flex-col gap-4 p-4">
                  <div className="sticky top-[32px] bg-background flex items-center gap-2 justify-between z-0">
                    <h2 className="text-xl">{dir.gameName}</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" asChild>
                        <Link to={`/screenshots/${dir.gameId}`}>View All ({dir.totalCount})</Link>
                      </Button>
                      <Button variant="outline" onClick={() => NativeOpen(dir.dir)}>
                        Browse Folder
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 flex-nowrap overflow-x-hidden max-w-full">
                    {dir.screenshots.map((file, i) => (
                      <ScreenshotImg
                        className="max-w-64 rounded-md"
                        screenshot={file}
                        key={file.path}
                        onClick={openScreenshotsModal(dir.screenshots, i)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </LoadingContainer>
          <ScreenshotsCarouselModal screenshots={modalScreenshots} activeIndex={modalIndex} />
        </Dialog>
      </div>
    </div>
  )
}
