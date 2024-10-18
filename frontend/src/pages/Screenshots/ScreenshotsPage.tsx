import { GetScreenshots } from '../../../wailsjs/go/main/App'
import { useApi } from '../../common/api'
import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'
import { LoadingContainer } from '../../components/Loader/LoadingContainer'

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
  const { screenshots, isFetching } = useScreenshotsDirs()
  console.debug('ScreenshotsPage', meta)
  return (
    <div className={cn('p-4')}>
      <h1 className="text-2xl mb-4">Screenshots</h1>

      <div>
        <LoadingContainer loading={isFetching}>
          <div className="flex flex-col gap-8">
            {screenshots.screenshotsDirs?.map((dir) => (
              <div key={dir.dir}>
                <h2 className="text-xl mb-2">{dir.gameName}</h2>
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
