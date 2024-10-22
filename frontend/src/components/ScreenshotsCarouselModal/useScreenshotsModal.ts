import { screenshots } from '$models'
import { useCallback, useState } from 'react'

export function useScreenshotsModal() {
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [modalScreenshots, setModalScreenshots] = useState<screenshots.ScreenshotEntry[]>([])
  const openScreenshotsModal = useCallback(
    (index: number, screenshots: screenshots.ScreenshotEntry[]) => {
      setModalIndex(index)
      setModalScreenshots(screenshots)
    },
    [],
  )
  const closeScreenshotsModal = useCallback(() => {
    setModalIndex(null)
    setModalScreenshots([])
  }, [])

  return { modalIndex, modalScreenshots, openScreenshotsModal, closeScreenshotsModal }
}
