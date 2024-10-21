import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar/Sidebar'
import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { GetLibraryInfo, OnWindowResize } from '$app'
import { ScreenshotsPage } from './pages/Screenshots/ScreenshotsPage'
import { useApi } from './common/api'
import { AppContext } from './common/app_context'
import { LoadingContainer } from './components/Loader/LoadingContainer'
import { GamesPage } from './pages/Games/GamesPage'

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
            <Sidebar className="min-w-64 w-64" />
            <div className="max-h-screen overflow-y-auto w-full">
              <Routes>
                <Route path="/" element={<GamesPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/screenshots/*" element={<ScreenshotsPage />} />
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
