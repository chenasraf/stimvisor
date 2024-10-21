import { useCallback, useMemo } from 'react'

export function useSorted<T>(arr: T[], sortFn: (obj: T) => string | number) {
  const sorter = useCallback(
    (a: T, b: T) => {
      const sortA = sortFn(a)
      const sortB = sortFn(b)
      switch (typeof sortA) {
        case 'string':
          return sortA.localeCompare(sortB as string)
        case 'number':
          return (sortA as number) - (sortB as number)
        default:
          return 0
      }
    },
    [sortFn],
  )
  return useMemo(() => [...arr].sort(sorter), [arr, sorter])
}
