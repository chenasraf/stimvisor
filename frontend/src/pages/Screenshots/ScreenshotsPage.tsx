import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'

export function ScreenshotsPage() {
  const { meta } = useAppContext()
  return (
    <div className={cn('')}>
      Screenshots
      <code>
        <pre>{JSON.stringify(meta, null, 2)}</pre>
      </code>
    </div>
  )
}
