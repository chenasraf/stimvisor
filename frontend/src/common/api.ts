import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'

type FullfilledUseQueryResult<TData = unknown, TError = Error> = Omit<
  UseQueryResult<TData, TError>,
  'data'
> & {
  data: Exclude<TData, undefined>
}

type WrappedUseQueryOptions<TData, TError, TQueryFnData> = UseQueryOptions<
  TQueryFnData,
  TError,
  TData
> & { debug?: boolean }

export function useApi<T>(
  promise: () => Promise<T>,
  options: Partial<WrappedUseQueryOptions<T, Error, T>> = {},
): FullfilledUseQueryResult<T, Error> {
  const query = useQuery({
    queryFn: async () => {
      if (options.debug) console.debug('useApi', promise)
      const json = await promise()
      if (options.debug) console.debug('useApi response:', json)
      return await (isError(json) ? Promise.reject(json.error) : Promise.resolve(json))
    },
    queryKey: [],
    ...options,
  })
  return query as FullfilledUseQueryResult<T, Error>
}

function isError(json: unknown): json is { error: unknown } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Boolean((json as any).error)
}
