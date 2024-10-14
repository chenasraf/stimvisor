import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

type FullfilledUseQueryResult<TData = unknown, TError = Error> = Omit<
  UseQueryResult<TData, TError>,
  'data'
> & {
  data: Exclude<TData, undefined>
}

export function useApi<T>(
  promise: () => Promise<unknown>,
  options: Partial<UseQueryOptions<unknown, Error, T>> = {},
): FullfilledUseQueryResult<T, Error> {
  const query = useQuery({
    queryFn: () =>
      promise()
        .then((result) => JSON.parse(result as string))
        .then((json) => (json.error ? Promise.reject(json.error) : Promise.resolve(json))),
    queryKey: [],
    ...options,
  })
  return query as FullfilledUseQueryResult<T, Error>
}
