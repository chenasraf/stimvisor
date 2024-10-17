import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar/Sidebar'
import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { OnWindowResize } from '../wailsjs/go/main/App'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  useEffect(() => {
    window.addEventListener('resize', OnWindowResize)
    return () => window.removeEventListener('resize', OnWindowResize)
  }, [])
  return (
    <HashRouter basename="/">
      <QueryClientProvider client={queryClient}>
        <div id="App" className="min-h-screen flex">
          <Sidebar className="w-64" />
          <div>
            <Routes>
              <Route path="/" element={<div />} />
              <Route path="/screenshots/*" element={<div />} />
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </HashRouter>
  )
}

export default App
