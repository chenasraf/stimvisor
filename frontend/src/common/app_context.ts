import { createContext, useContext } from 'react'
import { main } from '$models'

export const AppContext = createContext<AppContext>({ meta: {} as never })

export type AppContext = {
  meta: main.LibraryInfo
}

export function useAppContext() {
  return useContext(AppContext)
}
