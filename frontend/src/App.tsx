import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainSidebar } from './components/MainSidebar/MainSidebar'
import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { GetLibraryInfo, OnWindowResize } from '$app'
import { useApi } from './common/api'
import { AppContext } from './common/app_context'
import { LoadingContainer } from './components/Loader/LoadingContainer'
import { GamesHomePage } from './pages/Games/GamesHomePage'
import ScreenshotsGamePage from './pages/Screenshots/ScreenshotsGamePage'
import { ScreenshotsHome } from './pages/Screenshots/ScreenshotsHomePage'
import { GameInfoPage } from './pages/Games/GameInfoPage'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  useEffect(() => {
    window.addEventListener('resize', OnWindowResize)
    return () => window.removeEventListener('resize', OnWindowResize)
  }, [])
  return (
    <HashRouter basename="/">
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <div id="App" className="min-h-screen flex">
            <MainSidebar className="min-w-64 w-64" />
            <div className="max-h-screen overflow-y-auto w-full">
              <Routes>
                <Route path="/" element={<GamesHomePage />} />
                <Route path="/games/:gameId" element={<GameInfoPage />} />
                <Route path="/games/" element={<GamesHomePage />} />
                <Route path="/screenshots/:gameId" element={<ScreenshotsGamePage />} />
                <Route path="/screenshots/" element={<ScreenshotsHome />} />
              </Routes>
            </div>
          </div>
        </AppContextProvider>
      </QueryClientProvider>
    </HashRouter>
  )
}

function AppContextProvider({ children }: React.PropsWithChildren<object>) {
  const { data: meta, isFetching } = useApi(GetLibraryInfo, ['meta'], {
    initialData: {} as never,
    debug: true,
  })
  return (
    <LoadingContainer loading={isFetching}>
      <AppContext.Provider value={{ meta }}>{children}</AppContext.Provider>
    </LoadingContainer>
  )
}

export default App
