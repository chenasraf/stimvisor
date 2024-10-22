import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { Dialog } from '@/components/ui/dialog'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { GameScreenshotsListItem } from '@/components/GameScreenshotsListItem/GameScreenshotsListItem'
import { useScreenshotsModal } from '@/components/ScreenshotsCarouselModal/useScreenshotsModal'
import { useScreenshotsList } from '@/common/hooks/useScreenshots'

export function ScreenshotsHome() {
  const { screenshots, isFetching } = useScreenshotsList()
  const { modalIndex, closeScreenshotsModal, openScreenshotsModal, modalScreenshots } =
    useScreenshotsModal()
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
                <GameScreenshotsListItem
                  key={dir.dir}
                  collection={dir}
                  onScreenshotClick={(_e, _s, i, l) => openScreenshotsModal(i, l)}
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
