import { GetGameInfo } from '$app'
import { useApi } from '@/common/api'
import { useGameScreenshots } from '@/common/hooks/useScreenshots'
import { GameScreenshotsListItem } from '@/components/GameScreenshotsListItem/GameScreenshotsListItem'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { ScreenshotsCarouselModal } from '@/components/ScreenshotsCarouselModal/ScreenshotsCarouselModal'
import { useScreenshotsModal } from '@/components/ScreenshotsCarouselModal/useScreenshotsModal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog } from '@/components/ui/dialog'
import { useParams } from 'react-router-dom'

function useGame(gameId: string) {
  return useApi(() => GetGameInfo(gameId), ['game', gameId], {
    debug: true,
    initialData: {} as never,
  })
}

export function GameInfoPage() {
  const { gameId } = useParams()
  const { data, isFetching } = useGame(gameId!)
  const { screenshots } = useGameScreenshots(gameId!)
  const game = data.game ?? {}
  const { modalIndex, closeScreenshotsModal, openScreenshotsModal, modalScreenshots } =
    useScreenshotsModal()
  const [dir] = screenshots.screenshotCollections ?? [{ screenshots: [] }]

  return (
    <div>
      <Dialog
        modal
        open={modalIndex !== null}
        onOpenChange={(open) => !open && closeScreenshotsModal()}
      >
        <LoadingContainer loading={isFetching}>
          <div className="p-4 pb-3">
            <h1 className="text-2xl">{game.name}</h1>
          </div>

          <div className="flex flex-col gap-4 p-4 pt-0">
            <div dangerouslySetInnerHTML={{ __html: game.shortDescription }} />

            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger>See full description</AccordionTrigger>
                  <AccordionContent>
                    <div className="py-4" dangerouslySetInnerHTML={{ __html: game.description }} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            {dir?.screenshots?.length > 0 && (
              <div>
                <div className="flex flex-col gap-2">
                  <GameScreenshotsListItem
                    title="My Screenshots"
                    key={dir.dir}
                    collection={dir}
                    onScreenshotClick={(_e, _s, i, l) => openScreenshotsModal(i, l)}
                  />
                </div>
                <ScreenshotsCarouselModal screenshots={modalScreenshots} activeIndex={modalIndex} />
              </div>
            )}
          </div>
        </LoadingContainer>
      </Dialog>
    </div>
  )
}
