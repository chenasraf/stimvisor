import { GetGames } from '../../../wailsjs/go/main/App'
import { useApi } from '../../common/api'
import { useAppContext } from '../../common/app_context'
import { cn } from '../../common/utils'
import { LoadingContainer } from '../../components/Loader/LoadingContainer'

function useGames() {
  return useApi(GetGames, ['games'], {
    debug: true,
    initialData: {} as never,
  })
}

export function GamesPage() {
  const { meta } = useAppContext()
  const { data, isFetching } = useGames()
  console.debug('GamesPage', meta)
  return (
    <div className={cn('p-4')}>
      <h1 className="text-2xl">Games</h1>

      <div>
        <LoadingContainer loading={isFetching}>
          {data.games?.map((dir) => (
            <div key={dir.id}>
              <h2>{dir.name}</h2>
            </div>
          ))}
        </LoadingContainer>
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
