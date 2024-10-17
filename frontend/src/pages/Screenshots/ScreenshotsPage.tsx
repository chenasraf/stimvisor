import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'

export function ScreenshotsPage() {
  const { meta } = useAppContext()
  console.debug('ScreenshotsPage', meta)
  return (
    <div className={cn('p-4')}>
      <h1 className="text-2xl">Screenshots</h1>

      <div>
        {meta.screenshotsDirs.map((dir) => (
          <div key={dir.dir}>
            <h2>{dir.gameId}</h2>
            <div className="flex items-start gap-4 flex-wrap max-w-full">
              {dir.screenshots.map((file) => (
                <img className="max-w-64 rounded-md" key={file} src={file} alt={file} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <details>
        <summary>Meta</summary>
        <code>
          <pre>{JSON.stringify(meta, null, 2)}</pre>
        </code>
      </details>
    </div>
  )
}
