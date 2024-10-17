import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar/Sidebar'
import React, { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { GetSteamLibraryMeta, OnWindowResize } from '../wailsjs/go/main/App'
import { ScreenshotsPage } from './pages/Screenshots/ScreenshotsPage'
import { useApi } from './common/api'
import { AppContext } from './common/app_context'

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
            <div className="max-h-screen overflow-y-auto">
              <Routes>
                <Route path="/" element={<div />} />
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
  const { data: meta, isFetching } = useApi(() => GetSteamLibraryMeta(), {
    initialData: {} as never,
    debug: true,
  })
  if (!meta || isFetching) return <div>Loading...</div>
  return <AppContext.Provider value={{ meta }}>{children}</AppContext.Provider>
}

export default App
