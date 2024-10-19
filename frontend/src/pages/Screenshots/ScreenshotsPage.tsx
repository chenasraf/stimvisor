import { Link, Route, Routes, useParams } from 'react-router-dom'
import { GetScreenshots, GetScreenshotsForGame } from '../../../wailsjs/go/main/App'
import { useApi } from '../../common/api'
import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'
import { LoadingContainer } from '../../components/Loader/LoadingContainer'

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

export function ScreenshotsPage() {
  const { meta } = useAppContext()
  console.debug('ScreenshotsPage', meta)
  return (
    <Routes>
      <Route path="/:gameId" element={<ScreenshotsGamePage />} />
      <Route path="/" element={<ScreenshotsHome />} />
    </Routes>
  )
}

function ScreenshotsHome() {
  const { screenshots, isFetching } = useScreenshotsDirs()
  return (
    <div className={cn('p-4')}>
      <h1 className="text-2xl mb-4">Screenshots</h1>

      <div>
        <LoadingContainer loading={isFetching}>
          <div className="flex flex-col gap-8">
            {screenshots.screenshotsDirs?.map((dir) => (
              <div key={dir.dir}>
                <div className="flex items-center gap-2 justify-between">
                  <h2 className="text-xl mb-2">{dir.gameName}</h2>
                  <div>
                    <Link to={`/screenshots/${dir.gameId}`}>View All ({dir.totalCount})</Link>
                  </div>
                </div>
                <div className="flex items-start gap-4 flex-wrap max-w-full">
                  {dir.screenshots.map((file) => (
                    <img className="max-w-64 rounded-md" key={file} src={file} alt={file} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </LoadingContainer>
      </div>
    </div>
  )
}
function ScreenshotsGamePage() {
  const { gameId } = useParams()
  const { screenshots, isFetching } = useScreenshotsDir(gameId!)
  console.debug('ScreenshotsGamePage', gameId, screenshots)
  const dir = screenshots.screenshotsDir ?? { screenshots: [] }
  return (
    <div className={cn('p-4')}>
      <h1 className="text-2xl mb-4">Screenshots</h1>

      <div>
        <LoadingContainer loading={isFetching}>
          <div className="flex flex-col gap-8">
            <div key={dir.dir}>
              <div className="flex items-center gap-2 justify-between">
                <h2 className="text-xl mb-2">{dir.gameName}</h2>
              </div>
              <div className="flex items-start gap-4 flex-wrap max-w-full">
                {dir.screenshots.map((file) => (
                  <img className="max-w-64 rounded-md" key={file} src={file} alt={file} />
                ))}
              </div>
            </div>
          </div>
        </LoadingContainer>
      </div>
    </div>
  )
}
