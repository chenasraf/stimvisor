import { createContext, useContext } from 'react'
import { main } from '../../wailsjs/go/models'

export const AppContext = createContext<AppContext>({ meta: {} as never })

export type AppContext = {
  meta: main.SteamLibraryMeta
}

export function useAppContext() {
  return useContext(AppContext)
}
