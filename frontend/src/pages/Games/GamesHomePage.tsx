import { GetGames } from '$app'
import { useApi } from '@/common/api'
import { LoadingContainer } from '@/components/Loader/LoadingContainer'
import { FaFileCircleExclamation } from 'react-icons/fa6'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { HtmlProps } from '@/common/types'
import { Link } from 'react-router-dom'
import { FaGamepad } from 'react-icons/fa6'

function useGames() {
  return useApi(GetGames, ['games'], {
    debug: true,
    initialData: {} as never,
  })
}

export function GamesHomePage() {
  const { data, isFetching } = useGames()
  return (
    <div>
      <div className="p-4 pb-3">
        <h1 className="text-2xl">Games</h1>
      </div>

      <div className="p-4 pt-0 flex flex-col gap-4">
        <Alert>
          <FaFileCircleExclamation />
          <AlertTitle>Only Showing Some Games</AlertTitle>
          <AlertDescription>
            This list only shows games that have been downloaded on this machine before, and not all
            of them might contain data.
          </AlertDescription>
        </Alert>

        <div>
          <LoadingContainer loading={isFetching}>
            {data.games?.map((dir) => (
              <ListItem key={dir.id} label={dir.name} to={`/games/${dir.id}`} />
            ))}
          </LoadingContainer>
        </div>
      </div>
    </div>
  )
}

function ListItem({
  children,
  label,
  to,
  ...rest
}: HtmlProps<'div'> & {
  label: React.ReactNode
  to: string
}) {
  return (
    <Link to={to}>
      <div
        className="min-h-10 flex gap-4 items-center justify-start py-3 px-6 cursor-pointer transition-colors hover:bg-bg-800"
        {...rest}
      >
        <FaGamepad />
        {label}
      </div>
      {children ? <ul>{children}</ul> : null}
    </Link>
  )
}
