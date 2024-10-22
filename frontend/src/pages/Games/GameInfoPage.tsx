import { GetGameInfo } from '$app'
import { useApi } from '@/common/api'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  const game = data.game ?? {}

  return (
    <div>
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
                  <div className="p-4" dangerouslySetInnerHTML={{ __html: game.description }} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </LoadingContainer>
    </div>
  )
}
