import { useLocation } from 'react-router-dom'
import { useSessionStorage } from './useBrowserStorage'
import { useEffect, useState } from 'react'

export function useRecoverableScrollPosition(element: HTMLElement | null | undefined) {
  const location = useLocation()
  const scrollKeyValue = `scrollPos-${location.pathname}`
  const [scrollKey] = useState(scrollKeyValue)

  const [scrollPosition, setScrollPosition] = useSessionStorage(scrollKey, 0)

  useEffect(() => {
    if (!element) return
    if (scrollPosition) {
      element.scrollTo(0, scrollPosition)
      element.dataset.scrollPos = scrollPosition.toString()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])

  useEffect(() => {
    if (!element) return
    element.dataset.scrollPos = element.scrollTop.toString()

    const onScroll = () => {
      element.dataset.scrollPos = element.scrollTop.toString()
      setScrollPosition(element.scrollTop)
    }

    element.addEventListener('scroll', onScroll)

    return () => {
      element.removeEventListener('scroll', onScroll)
      element.dataset.scrollPos = ''
      setScrollPosition(element.scrollTop)
    }
  }, [element, scrollKey, scrollPosition, setScrollPosition])
}
