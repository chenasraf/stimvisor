import { GetScreenshots, GetScreenshotsForGame } from '$app'
import { useApi } from '../api'

export function useGameScreenshots(gameId: string) {
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

export function useScreenshotsList() {
  const { data: screenshots, ...rest } = useApi(GetScreenshots, ['screenshots'], {
    debug: true,
    initialData: {} as never,
  })
  return {
    screenshots: screenshots ?? {},
    ...rest,
  }
}
