import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar/Sidebar'
import { useState } from 'react'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <div id="App" className="min-h-screen flex">
        <Sidebar className="w-64" />
        <div />
      </div>
    </QueryClientProvider>
  )
}

export default App
