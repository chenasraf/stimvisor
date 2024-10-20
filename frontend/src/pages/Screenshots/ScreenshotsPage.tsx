import { Link, Route, Routes, useParams } from 'react-router-dom'
import { GetScreenshots, GetScreenshotsForGame, NativeOpen } from '../../../wailsjs/go/main/App'
import { useApi } from '../../common/api'
import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'
import { LoadingContainer } from '../../components/Loader/LoadingContainer'
import { Button } from '@/components/ui/button'
import { FaAngleLeft } from 'react-icons/fa6'

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
            {screenshots.screenshotCollections?.map((dir) => (
              <div key={dir.dir} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
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
                <div className="flex items-start gap-4 flex-wrap max-w-full">
                  {dir.screenshots.map((file) => (
                    <img
                      className="max-w-64 rounded-md"
                      key={file.path}
                      src={file.base64}
                      alt={file.name}
                    />
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
  const [dir] = screenshots.screenshotCollections ?? [{ screenshots: [] }]
  return (
    <div className={cn('p-4')}>
      <div className="flex flex-col gap-2">
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/screenshots">
              <FaAngleLeft />
              Back
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl mb-4">Screenshots for {dir.gameName}</h1>
      </div>

      <div>
        <LoadingContainer loading={isFetching}>
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4 flex-wrap max-w-full">
              {dir.screenshots.map((file) => (
                <img
                  className="max-w-64 rounded-md"
                  key={file.path}
                  src={file.base64}
                  alt={file.name}
                />
              ))}
            </div>
          </div>
        </LoadingContainer>
      </div>
    </div>
  )
}
