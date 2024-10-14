import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar/Sidebar'
import { useState } from 'react'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <div id="App" className="bg-bg min-h-screen text-gray-400">
      <QueryClientProvider client={queryClient}>
        <Sidebar />
      </QueryClientProvider>
    </div>
  )
}

export default App
