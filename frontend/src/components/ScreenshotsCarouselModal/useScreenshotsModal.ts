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

  const deleteScreenshot = useCallback((idx: number) => {
    setModalScreenshots((screenshots) => {
      const newScreenshots = [...screenshots]
      newScreenshots.splice(idx, 1)
      return newScreenshots
    })
    // if (modalIndex === idx) {
    //   setModalIndex((i) => (i === 0 ? null : i! - 1))
    // }
  }, [])

  return {
    modalIndex,
    modalScreenshots,
    openScreenshotsModal,
    closeScreenshotsModal,
    deleteScreenshot,
  }
}
