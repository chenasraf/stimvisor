import { useEffect, useRef, useState } from 'react'

export function useStateRef<T>(
  initialValue: T,
): [T, (value: T) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState(initialValue)
  const ref = useRef(state)

  useEffect(() => {
    if (state !== ref.current) {
      ref.current = state
    }
  }, [state])

  return [state, setState, ref]
}
