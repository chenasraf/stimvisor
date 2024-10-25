import { useEffect, useState } from 'react'

export function useBrowserStorage<S extends Storage, T>(storage: S, key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = storage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })
  useEffect(() => {
    if (value === null) {
      storage.removeItem(key)
    } else {
      storage.setItem(key, JSON.stringify(value))
    }
  }, [key, value, storage])
  return [value, setValue] as const
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  return useBrowserStorage(localStorage, key, initialValue)
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  return useBrowserStorage(sessionStorage, key, initialValue)
}
